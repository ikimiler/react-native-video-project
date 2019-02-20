import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Colors from '../utils/Colors'
import { queryDownloadVideoAll, deleteDownloadVideo } from '../utils/DButils'
import DownloadManager from '../utils/DownloadManager'
import fs from 'react-native-fs'
import toast from 'react-native-root-toast'
import Loadding from '../components/Loadding'
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-root-toast';


export default class DownloadPage extends BaseFlatListComponent {

    enbaleRefresh = false;
    enableLoadMore = false;

    componentDidMount() {
        DownloadManager.addListener(this.callback)
        super.componentDidMount()
    }

    componentWillUnmount() {
        this.loadding && Loadding.hide(this.loadding)
        DownloadManager.removeListener(this.callback)
    }

    callback = () => {
        this.initData()
    }

    /**
     * 查询数据，本地已经缓存的+正在下载的
     */
    initData() {
        //正在进行中的任务
        let runningTask = DownloadManager.allRunningTask
        let runningResult = []
        for (let obj of runningTask.values()) {
            obj.running = true;
            obj.offline = true;
            runningResult.push(obj)
        }

        queryDownloadVideoAll().then(res => {
            let keys = Object.keys(res)
            let result = [];
            for (let i = keys.length - 1; i >= 0; i--) {
                let obj = res[keys[i]]
                obj.offline = true;
                result.push(obj)
            }
            let datas = [...runningResult.reverse(), ...result,]
            if (datas.length == 0) {
                this.update(this.LOAD_EMPTY)
            } else {
                this.setState({ datas: datas }, () => this.update(this.LOAD_SUCCESS))
            }
        }).catch(error => {
            console.log('netlog-', error)
            this.update(this.LOAD_FAILED)
        })
    }

    updateDB(data) {
        deleteDownloadVideo(data).then(res => {
            this.initData()
            this.hideLoadding()
        }).catch(error => {
            console.log('netlog-', error)
            this.hideLoadding()
        })
    }

    showLoadding() {
        this.hideLoadding()
        this.loadding = Loadding.show();
    }

    hideLoadding() {
        this.loadding && Loadding.hide(this.loadding)
    }

    playerVideo = data => {
        this.showLoadding()
        //检测文件是否已经被删除
        fs.exists(data.file).then(res => {
            if (res) {
                this.props.navigation.navigate("OfflineVideoPlayer", { data })
                this.hideLoadding()
            } else {
                //同步本地数据库
                toast.show('文件可能已经被删除掉了，请重新下载')
                this.updateDB(data)
            }
        }).catch(error => {
            toast.show('文件可能已经被删除掉了，请重新下载')
            //同步本地数据库
            this.updateDB(data)
        })
    }

    _renderHeader() {
        // let totalSD = (DeviceInfo.getTotalDiskCapacity() / (1024 * 1024 * 1024))
        // let freeSD = (DeviceInfo.getFreeDiskStorage() / (1024 * 1024 * 1024)) 
        return (
            <View style={{ backgroundColor: 'red', justifyContent: 'center', padding: 5 }}>
                <Text style={{ color: 'white' }}>下载过程中请保持app为打开状态，否则数据会丢失。已经下载的视频，长按即可删除哦~</Text>
            </View>
        )
    }

    renderRow = rowdata => {
        let title = rowdata.title + (rowdata.index > 0 ? ` 第${rowdata.index}集` : "")
        let image = { uri: rowdata.coverUrl }

        //status: 0, // 0 运行中 -1 失败 2成功
        let status = rowdata.status;
        let message = "";
        if (status == 0) {
            let progress = (rowdata.progress / rowdata.maxProgress) * 100;
            message = "正在努力下载中 " + progress.toFixed(2) + "%"
        } else if (status == -1) {
            message = "下载发生了错误,点击重试"
        }

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onLongPress={() => {
                    //删除
                    if (!rowdata.running) {
                        Alert.alert("提示:", "删除该视频的本地缓存?",
                            [
                                { text: '取消', onPress: () => { }},
                                {
                                    text: '确定', onPress: () => {
                                        this.showLoadding()
                                        DownloadManager.deleteCacheVideo(rowdata).then(res => {
                                            Toast.show("视频删除成功")
                                            this.initData()
                                            this.hideLoadding()
                                        }).catch(error => {
                                            console.log('netlog-',error)
                                            Toast.show("视频删除失败,请重试")
                                            this.hideLoadding()
                                        })
                                    }
                                },
                            ]
                        )
                    }
                }}
                onPress={() => {
                    if (status == -1) {
                        //重新下载
                        DownloadManager.resetDownLoad(rowdata)
                    } else if (status == 0) {
                        Toast.show("正在拼命下载中...")
                    } else {
                        this.playerVideo(rowdata)
                    }
                }}
                style={styles.itemStyle}>
                <View style={{ width: 120, height: 80 }}>
                    <Image style={{ width: 120, height: 80 }} resizeMode="cover" source={image}></Image>
                </View>
                <View style={{ flex: 1, height: 80, justifyContent: 'space-between', marginLeft: 10 }}>
                    <Text numberOfLines={2}>{title}</Text>
                    <Text>{message}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 100,
    },
    buttonStyle: {
        backgroundColor: Colors.mainColor,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white'
    }
})