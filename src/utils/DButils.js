import Realm from 'realm'

/**
 * 播放历史记录数据表
 */
const HistoryVideoSchema = {
    name: 'HistoryVideo',
    primaryKey: 'id',
    properties: {
        id: 'int',
        name: 'string',
        coverUrl: 'string',
        progress: 'int',
        level: 'int'
    }
}

/**
 * 搜索历史数据表
 */
const HistorySearchContentSchema = {
    name: 'HistorySearchContent',
    primaryKey: 'name',
    properties: {
        name: 'string'
    }
}

/**
 * 视频收藏数据表
 */
const CollectVideoSchema = {
    name: 'CollectVideo',
    primaryKey: 'videoInfoId',
    properties: {
        videoInfoId: 'int',
        title:'string',
        coverUrl:'string',
        tagName:{type:'string',default:'无标签'},
    }
}

/**
 * 视频缓存数据表
 */
const DownloadVideoSchema = {
    name: 'DownloadVideo',
    primaryKey:'id',
    properties: {
        id:"int",
        url: 'string', //以url为准
        title:'string', //视频名称
        index:'int', //集数
        coverUrl:'string', //视频封面
        file:'string', //本地存储路径，m3u8文件
        playCount:'int',//播放次数
        imdbScore:'int',//豆瓣评分
        director:'string',//导演
        staring:'string',//演员
        intro:'string', //简介
        type:'int',//类型 电影 电视剧 动漫 综艺
        classifyTypeListValue:'string' ,// 分类
    }
}

const instance = new Realm({
    schema: [
        HistoryVideoSchema,
        HistorySearchContentSchema,
        CollectVideoSchema,
        DownloadVideoSchema
    ],
    deleteRealmIfMigrationNeeded:true,
    inMemory:false,
});


/** --------------------- 视频播放记录 ----------------------------- */
export function writeHistoryVideo(obj) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            instance.create('HistoryVideo', obj, true)
            resolve(true)
        })
    })
}

export function queryAllHistoryVideo() {
    return new Promise((resolve, reject) => {
        let obj = instance.objects('HistoryVideo')
        let objStr = JSON.stringify(obj)
        resolve(JSON.parse(objStr))
    })
}

export function clearAllHistoryVideo() {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('HistoryVideo');
            instance.delete(arrays)
            resolve(true)
        })
    })
}


/** --------------------- 搜索记录 ----------------------------- */
export function writeHistorySearchContent(name) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            instance.create('HistorySearchContent', { name }, true)
            resolve(true)
        })
    })
}

export function queryAllHistorySearchContent() {
    return new Promise((resolve, reject) => {
        let obj = instance.objects('HistorySearchContent')
        let objStr = JSON.stringify(obj)
        resolve(JSON.parse(objStr))
    })
}

export function clearAllHistorySearchConten() {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('HistorySearchContent');
            instance.delete(arrays)
            resolve(true)
        })
    })
}

/** --------------------- 视频收藏 ----------------------------- */

export function writeCollectVideo(data) {
    if(!data.tagName) data.tagName = "无标签"
    return new Promise((resolve, reject) => {
        instance.write(() => {
            instance.create('CollectVideo', data, true)
            resolve(true)
        })
    })
}

export function queryAllCollectVideo() {
    return new Promise((resolve, reject) => {
        let obj = instance.objects('CollectVideo');
        let objStr = JSON.stringify(obj)
        resolve(JSON.parse(objStr))
    })
}

export function clearAllCollectVideo() {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('CollectVideo');
            instance.delete(arrays)
            resolve(true)
        })
    })
}

export function deleteCollectVideo(data) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('CollectVideo');
            let res = arrays.filtered(`videoInfoId == ${data.videoInfoId}`)
            instance.delete(res)
            resolve(true)
        })
    })
}

export function queryCollectVideo(data) {
    return new Promise((resolve, reject) => {
        let arrays = instance.objects('CollectVideo');
        let res = arrays.filtered(`videoInfoId == ${data.videoInfoId}`)
        let objStr = JSON.stringify(res)
        resolve(JSON.parse(objStr))
    })
}


/** --------------------- 视频缓存 ----------------------------- */
export function queryDownloadVideoAll() {
    return new Promise((resolve, reject) => {
        let arrays = instance.objects('DownloadVideo');
        let objStr = JSON.stringify(arrays)
        resolve(JSON.parse(objStr))
    })
}

export function clearDownloadVideoAll() {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('DownloadVideo');
            instance.delete(arrays)
            resolve(true)
        })
    })
}

export function deleteDownloadVideo(data) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            let arrays = instance.objects('DownloadVideo');
            let res = arrays.filtered(`id == ${data.id}`)
            instance.delete(res)
            resolve(true)
        })
    })
}

export function writeDownloadVideo(data) {
    return new Promise((resolve, reject) => {
        instance.write(() => {
            instance.create('DownloadVideo', data, true)
            resolve(true)
        })
    })
}