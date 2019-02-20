import React from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Share, ListView ,NativeModules,BackHandler} from 'react-native'
import BaseComponent from '../components/BaseComponent'
import VideoWrapper from '../views/VideoWrapper'
import { writeHistoryVideo, queryCollectVideo, deleteCollectVideo, writeCollectVideo } from '../utils/DButils'
import Colors from '../utils/Colors'
import Toast from 'react-native-root-toast'
import DownloadManager from '../utils/DownloadManager'
import Loadding from '../components/Loadding'
import data from '../../data.json'
import config from '../../config.json'


export default class VideoInfo extends BaseComponent {

    videoItemIndex = 0;
    params = {};
    state = {
        data: {},
        totalVideoList: [],
        isCollect: false,
        downloadComponentShow: false,
    }

    componentWillMount(){
        this.subscription = BackHandler.addEventListener("hardwareBackPress",this.onBack)
    }

    onBack = () => {
        if(this.state.downloadComponentShow){
            this.setState({downloadComponentShow:false})
            return true;
        }else{
            return false;
        }
    }

    async componentWillUnmount() {
        this.subscription && this.subscription.remove()
        this.hideLoadding()
        //事件回调
        this.scrollTask && clearTimeout(this.scrollTask)
        //存储播放记录
        let data = this.state.data;
        if (!data.title || !data.id || !data.coverUrl || !this.progressOption) return;
        let id = data.id;
        let name = data.title;
        let level = this.videoItemIndex;
        let progress = (this.progressOption.currentTime / this.progressOption.seekableDuration) * 100
        let coverUrl = data.coverUrl;
        let obj = { id, name, coverUrl, progress, level }
        await writeHistoryVideo(obj)
        this.props.navigation.state.params.onBack && this.props.navigation.state.params.onBack();
    }

    initData() {
        this.queryVideoCollect();
        setTimeout(() => {
            this.queryTotalVideoList(data.VideoInfoData.data);
        }, config.delayed);
    }

    queryVideoCollect() {
        let data = this.props.navigation.state.params.data
        queryCollectVideo(data).then(res => {
            if (Object.keys(res).length) {
                this.setState({ isCollect: true })
            } else {
                this.setState({ isCollect: false })
            }
        })
    }

    addVideoCollect() {
        let data = this.props.navigation.state.params.data
        writeCollectVideo(data).then(res => {
            this.queryVideoCollect();
        })
    }

    deleteVideoCollect() {
        let data = this.props.navigation.state.params.data
        deleteCollectVideo(data).then(res => {
            this.queryVideoCollect();
        })
    }

    queryTotalVideoList(data) {
        this.setState({ data, totalVideoList: data.videoList }, () => this.update(this.LOAD_SUCCESS, () => {
            if (this.params.history) {
                this.scrollTask = setTimeout(() => {
                    let videoItemIndex = this.params.level;
                    this.listview && this.listview.scrollTo(0, 55 * videoItemIndex)
                }, this.params.level * 10);
            }
        }))
    }

    _renderHeader() {
        let item = null
        //从播放历史进入
        if (this.params.history) {
            this.videoItemIndex = this.params.level;
        }
        if (this.state.totalVideoList.length) {
            item = this.state.totalVideoList[this.videoItemIndex]
        }

        return (
            <VideoWrapper
                ref={ref => this.videoWrapper = ref}
                item={item}
                navigation={this.props.navigation}
                seek={this.params.progress}
                onProgress={options => this.progressOption = options}
                onLoad={data => {
                    if (this.params.history) {
                        this.params.history = false;
                        this.params.progress = 0;
                    }
                }}
                onEnd={() => {
                    let data = this.state.data;
                    if (data.videoList[this.videoItemIndex + 1]) {
                        this.videoItemIndex += 1;
                        this.forceUpdate(() => this.videoWrapper.startPlayVideo());
                    }
                }} />
        )
    }

    dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    itemWidth = (DEVICE.width - 70) / 5;

    _renderVideoItems = () => {
        let data = this.state.totalVideoList;
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        if (data.length > 1) {
            return (
                <View>
                    <Text style={{ color: 'black', fontSize: 16 }}>选集</Text>
                    <ListView
                        removeClippedSubviews={DEVICE.android ? true : false}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        ref={ref => this.listview = ref}
                        contentContainerStyle={{ paddingVertical: 10 }}
                        initialListSize={this.params.history ? this.params.level + 10 : 10}
                        dataSource={dataSource.cloneWithRows(data)}
                        renderRow={(rowData, sectionID, rowID, highlightRow) => {
                            let index = parseInt(rowID)
                            let i = index + 1;
                            let color = this.videoItemIndex == index ? "#C47F14" : '#666666'
                            let text = this.state.data.type == 4 ? `第${i}期` : i;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        if (this.videoItemIndex !== index) {
                                            this.videoItemIndex = index;
                                            this.forceUpdate()
                                        }
                                    }}
                                    style={[styles.buttonStyle, {
                                        marginRight: 10,
                                        padding: 0,
                                        minWidth: 45,
                                        height: 45,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }]}>
                                    <Text style={{ color, fontSize: 15, fontWeight: 'bold' }}>{text}</Text>
                                </TouchableOpacity>
                            );
                        }}>
                    </ListView>
                </View>
            );
        } else {
            return null;
        }
    }


    renderComponent() {
        let data = this.state.data;
        let playCount = parseInt(data.playCount)
        if (playCount > 10000) {
            playCount = (playCount / 10000).toFixed(1) + '万'
        }
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    {this._renderVideoItems()}

                    <Text style={[styles.itemStyle, { fontSize: 18, color: 'black' }]}>{data.title}</Text>
                    <View style={styles.itemBetweenStyle}>
                        <Text>播放: {playCount}次</Text>
                        <Text style={[styles.buttonStyle, { backgroundColor: Colors.mainColor }]}>豆瓣: {data.imdbScore > 0 ? data.imdbScore : '6.0'}</Text>
                    </View>
                    <Text style={styles.itemStyle}>分类: {data.classifyTypeList.join('/')}</Text>
                    <Text style={styles.itemStyle}>导演: {data.director}</Text>
                    <Text style={styles.itemStyle}>演员: {data.staring}</Text>
                    <Text style={styles.itemStyle}>简介: </Text>
                    <Text style={[styles.itemStyle, { marginTop: 10 }]}>      {data.intro}</Text>
                </ScrollView>
            </View>
        );
    }

    /**
     * 下载选集对应得component
     */
    _renderOther2() {
        if (!this.state.downloadComponentShow) return null;

        let data = this.state.totalVideoList;
        let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
        if (data.length > 1) {
            return (
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0, backgroundColor: 'white' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 45,paddingHorizontal:10 }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>选集</Text>
                        <Text 
                            style={{ color: 'black', fontSize: 16 }}
                            onPress={() => this.setState({downloadComponentShow:false})}
                            >关闭</Text>
                    </View>
                    <ListView
                        showsVerticalScrollIndicator={false}
                        initialListSize={data.length}
                        ref={ref => this.listview = ref}
                        contentContainerStyle={{ flexDirection: 'row', justifyContent: 'flex-start', flexWrap: 'wrap',paddingLeft:10 }}
                        dataSource={dataSource.cloneWithRows(data)}
                        renderRow={(rowData, sectionID, rowID, highlightRow) => {
                            let index = parseInt(rowID)
                            let i = index + 1;
                            let color = '#666666'
                            let text = this.state.data.type == 4 ? `第${i}期` : i;
                            return (
                                <TouchableOpacity
                                    activeOpacity={0.7}
                                    onPress={() => {
                                        this.downloadVideo(rowData,i)
                                    }}
                                    style={[styles.buttonStyle, {
                                        width: Math.floor((DEVICE.width - 50) / 4),
                                        height: 45,
                                        marginRight:10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginBottom:10,
                                    }]}>
                                    <Text style={{ color, fontSize: 15, fontWeight: 'bold' }}>{text}</Text>
                                </TouchableOpacity>
                            );
                        }}>
                    </ListView>
                </View>
            );
        } else {
            return null;
        }
    }

    _renderOther() {
        let collectImg = this.state.isCollect ? require('../../source/image/shoucang.png') : require('../../source/image/icon_shoucang.png')
        let collectText = this.state.isCollect ? "取消收藏" : "  收藏  "
        return (
            <View style={styles.bottomStyle}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        Share.share({
                            title: '来嘻哈影视，看免费高清大片',
                            message: '最新，最全，无广告，请上嘻哈影视 https://github.com/andmizi',
                            url: '最新，最全，无广告，请上嘻哈影视https://github.com/andmizi'
                        })
                    }}
                    style={{ flex: 1, alignItems: 'center' }}>
                    <Image style={styles.bottomImageStyle} resizeMode='contain' source={require('../../source/image/icon_share.png')}></Image>
                    <Text style={{ color: 'black' }}>分享</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        if (this.state.isCollect) {
                            this.deleteVideoCollect();
                        } else {
                            this.addVideoCollect()
                        }
                    }}
                    style={{ flex: 1, alignItems: 'center' }}>
                    <Image style={styles.bottomImageStyle} resizeMode='contain' source={collectImg}></Image>
                    <Text style={{ color: 'black' }}>{collectText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        let data = this.state.totalVideoList
                        if(data.length == 0) return;
                        if (data.length > 1) {
                            this.setState({ downloadComponentShow: true })
                        } else {
                            this.downloadVideo(data[0],-1)
                        }
                    }
                    }
                    style={{ flex: 1, alignItems: 'center' }}>
                    <Image style={styles.bottomImageStyle} resizeMode='contain' source={require('../../source/image/icon_down.png')}></Image>
                    <Text style={{ color: 'black' }}>缓存</Text>
                </TouchableOpacity>
            </View>
        );
    }

    showLoadding() {
        this.hideLoadding()
        this.loadding = Loadding.show();
    }

    hideLoadding() {
        this.loadding && Loadding.hide(this.loadding)
    }

    /**
     * 开始下载
     * @param {*} data 
     */
    startDownloadVideo(data,index){
        // let qualityMap = new Map();
        // if (data.m3u8Format['1080P']) {
        //     qualityMap.set('1080P', data.m3u8Format['1080P'])
        // }
        // if (data.m3u8Format['720P']) {
        //     qualityMap.set('720P', data.m3u8Format['720P'])
        // }
        // if (data.m3u8Format['480P']) {
        //     qualityMap.set('480P', data.m3u8Format['480P'])
        // }
        // if (data.m3u8Format['360P']) {
        //     qualityMap.set('360P', data.m3u8Format['360P'])
        // }
        // if (data.m3u8Format['free'] && data.freeShow) {
        //     qualityMap.set('free', data.m3u8Format['free'])
        // }

        // let playUrl = data.m3u8PlayUrl;
        // //默认取第一个
        // let arr = Array.from(qualityMap.keys());
        // let videoQuality = arr[0]
        // let url = playUrl + qualityMap.get(videoQuality);

        // console.log('netlog-',data.id,url)
        this.hideLoadding()

        // properties: {
        //     id:"int",
        //     url: 'string', //以url为准
        //     title:'string', //视频名称
        //     index:'int', //集数
        //     coverUrl:'string', //视频封面
        //     file:'string', //本地存储路径，m3u8文件
        //     playCount:'string',//播放次数
        //     imdbScore:'int',//豆瓣评分
        //     director:'string',//导演
        //     staring:'string',//演员
        //     intro:'string', //简介
        //     type:'int',//类型 电影 电视剧 动漫 综艺
        // }
        let params = Object.assign({},this.state.data)
        params.url = data;
        params.index = index;
        params.id = data.id;
        params.classifyTypeListValue = params.classifyTypeList.join('/')
        
        DownloadManager.downLoad(params)
    }

    /**
     * 开始下载视频
     * @param {*} data 
     */
    downloadVideo(data,index) {
        this.showLoadding()
        setTimeout(() => {
            this.startDownloadVideo(config.videoUrl,index)
        }, config.delayed);
    }
}

var styles = StyleSheet.create({
    itemBetweenStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 40,
    },
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 30,
        textAlignVertical: 'center'
    },
    buttonStyle: {
        backgroundColor: '#EFF0EB',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        textAlign: 'center',
        textAlignVertical: 'center',
        color: 'white'
    },
    bottomStyle: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    bottomImageStyle: {
        width: 20,
        height: 20
    }
})