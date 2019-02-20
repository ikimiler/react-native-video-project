import fs from 'react-native-fs'
import { queryDownloadVideoAll, writeDownloadVideo,deleteDownloadVideo } from '../utils/DButils'
import Toast from 'react-native-root-toast'


const baseFile = DEVICE.android ? fs.ExternalStorageDirectoryPath + "/ColaApp" : fs.LibraryDirectoryPath + "/ColaApp";
fs.exists(baseFile).then(exists => {
  if (!exists) {
    fs.mkdir(baseFile)
  }
})


class DownloadManager {

  /**
   * 删除文件
   * @param {*} data 
   */
  deleteCacheVideo(data) {
    return new Promise(async function(resolve,reject) {
      try {
        let file = data.file;
        let exitis = await fs.exists(file)
        if (exitis) {
          let lastIndex = file.lastIndexOf("/")
          let dir = file.substring(0, lastIndex)
          await fs.unlink(dir)
          //同时删除数据库的记录
          await deleteDownloadVideo(data)
          resolve(true)
        } else {
          reject(false)
        }
      } catch (error) {
        console.log('netlog-', error)
        reject(false)
      }
    })
  }

  checkSafeUrl(data) {
    let url = data.url;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      Toast.show("非法的下载链接")
      return false;
    } else if (url.indexOf('.m3u8') > -1) {
      if (url.indexOf('?') > -1) {
        data.url = url.substring(0, url.indexOf('?'))
      }
      return true;
    }
    Toast.show("暂不支持此格式视频")
    return false;
  }

  /**
   * 正在进行中的任务
   *  {
   *    maxProgress: 100,
        progress: 0,
        status:0, // 0 运行中 -1 失败 2成功
        toFile:toFile,
   *  }
   */
  allRunningTask = new Map()
  listeners = new Set();

  addListener(listener = () => { }) {
    this.listeners.add(listener)
  }

  removeListener(listener = () => { }) {
    if (this.listeners.has(listener)) {
      this.listeners.delete(listener)
    }
  }

  /**
   * 观察者模式，对外发送通知
   */
  _updatelisteners() {
    for (let listener of this.listeners) {
      listener && listener();
    }
  }

  downLoad(data) {
    let result = this.checkSafeUrl(data);
    if (result) {
      this.startDownloadM3U8(data)
    }
  }

  resetDownLoad(data) {
    let result = this.checkSafeUrl(data);
    if (result) {
      if (this.allRunningTask.has(data.id)) {
        this.allRunningTask.delete(data.id)
      }
      this.startDownloadM3U8(data)
    }
  }

  /**
   * 开始下载m3u8文件
   * @param {*} url 
   */
  async startDownloadM3U8(data) {
    console.log('netlog-download', data.id)
    //已经存在了，直接return
    if (this.allRunningTask.has(data.id)) {
      if (this.allRunningTask.get(data.id).status == 0) {
        Toast.show("任务已经在下载队列中了，请不要重复下载")
        return;
      } else if (this.allRunningTask.get(data.id).status == 2) {
        Toast.show("您已经下载过该视频，请不要重复下载")
        return;
      }
    }

    //查询本地已经下载成功的视频
    let videos = await queryDownloadVideoAll();
    let keys = Object.keys(videos)
    let localFile;
    for (let i = 0; i < keys.length; i++) {
      let obj = videos[keys[i]]
      if (obj && obj.id == data.id) {
        localFile = obj.file;
      }
    }

    if (localFile) {
      let flag = await fs.exists(localFile)
      if (flag) {
        Toast.show("您已经下载过该视频，请不要重复下载")
        return;
      }
    }

    Toast.show("开始下载...")

    //根据url获取到对应的本地目录
    let url = data.url;
    let urlSplits = url.split("/");
    let scheme = urlSplits[0];
    let baseUrl = urlSplits[2];
    let path = urlSplits.slice(3, urlSplits.length - 1).join("/")
    let fileName = urlSplits[urlSplits.length - 1]

    let toDirPath = baseFile + "/" + path;
    await fs.mkdir(toDirPath)
    let toFile = toDirPath + "/" + fileName;

    data.maxProgress = 100;
    data.progress = 0;
    data.status = 0;
    data.toFile = toFile;
    data.file = toFile;
    //添加m3u8下载任务到缓存
    this.allRunningTask.set(data.id, data)

    //开始下载m3u8文件
    let task = fs.downloadFile({
      fromUrl: url,
      toFile: toFile,
      connectionTimeout: 1000 * 60,
      readTimeout: 1000 * 60,
      begin: function (res) {
      },
      progress: function (res) {
      },
    });

    let result = await task.promise
    if (result.statusCode == 200) {
      console.log('netlog-m3u8下载成功', toFile, url, result)
      try {
        //m3u8下载成功,开始逐步下载ts文件
        await this.readM3U8File(data, url, toFile, toDirPath)
        console.log('netlog-', '所有ts文件都下载成功了')
        //标记下载成功
        this.allRunningTask.get(data.id).status = 2;
        //写入本地数据库
        await writeDownloadVideo(data)
        console.log('netlog-', '插入本地数据库成功了')
        //删除内存中缓存
        this.allRunningTask.delete(data.id)
        Toast.show(data.title + "下载成功了,请到下载中心查看")
        //通知出去
        this._updatelisteners()
      } catch (error) {
        Toast.show("哎哟，下载出现了异常", error)
        console.log('netlog-', '哎哟，下载出现了异常', error)
        this.allRunningTask.get(data.id).status = -1;
        //通知出去
        this._updatelisteners()
      }
    } else {
      console.log('哎哟，下载出现了异常')
      Toast.show("哎哟，下载出现了异常")
      this.allRunningTask.get(data.id).status = -1;
      //通知出去
      this._updatelisteners()
    }
  }

  /**
   * 读取m3u8对应的内容，获取到对应的ts文件地址
   * @param {*} m3u8Url 
   * @param {*} m3u8File 
   * @param {*} m3u8Dir 
   */
  async readM3U8File(data, m3u8Url, m3u8File, m3u8Dir) {
    let result = await fs.readFile(m3u8File)
    let lines = result.split('\n');

    let tsUrls = [];
    for (let line of lines) {
      if (line.endsWith('.ts') || line.indexOf("ts") > -1) {
        tsUrls.push(line)
      }
    }
    //设置最大进度，默认为ts文件数为单位
    this.allRunningTask.get(data.id).maxProgress = tsUrls.length;
    //开始下载ts文件
    await this.startDownloadTS(data, m3u8Url, tsUrls, 0, m3u8Dir);
  }

  /**
   * 开始下载ts文件
   * @param {*} m3u8Url 
   * @param {*} tsUrls 
   * @param {*} index 
   * @param {*} m3u8Dir 
   */
  async startDownloadTS(data, m3u8Url, tsUrls, index, m3u8Dir) {
    if (index >= tsUrls.length) {
      return;
    };
    // if (index >= 10) {
    //   return;
    // };

    let url = tsUrls[index];
    //如果ts文件中包含路径，当文件夹形式处理
    if (url.lastIndexOf("/") > -1) {
      let targetDir = m3u8Dir + "/" + url.substring(0, url.lastIndexOf('/'))
      let exists = await fs.exists(targetDir)
      if (!exists) {
        await fs.mkdir(targetDir)
      }
    }

    let downloadUrl = m3u8Url.substring(0, m3u8Url.lastIndexOf("/") + 1) + url;
    let toFile = m3u8Dir + "/" + url;
    let result = await this.createDownloadTSPromise(downloadUrl, toFile)
    console.log('netlog-ts下载成功了', toFile, downloadUrl, result)

    //刷新进度
    this.allRunningTask.get(data.id).progress = index + 1;
    //通知出去
    this._updatelisteners()
    await this.startDownloadTS(data, m3u8Url, tsUrls, index + 1, m3u8Dir)
  }

  /**
   * 创建ts下载任务
   * @param {*} url 
   * @param {*} file 
   */
  createDownloadTSPromise(url, file) {
    let task = fs.downloadFile({
      fromUrl: url,
      toFile: file,
      connectionTimeout: 1000 * 60,
      readTimeout: 1000 * 60,
      begin: function (res) {
      },
      progress: function (res) {
      },
    });
    return task.promise
  }

}

const DownloadManagerInstance = new DownloadManager()

export default DownloadManagerInstance;