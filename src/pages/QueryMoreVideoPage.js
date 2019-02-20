import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Colors from '../utils/Colors'
import data from '../../data.json'
import config from '../../config.json'

const itemWidth = Math.floor((DEVICE.width - 10) / 3);
const itemHeight = Math.floor(itemWidth * 1.3)
const finalStyle = { width: itemWidth, height: itemHeight }

//this.props.id 0推荐 1电影 2电视剧 3动漫 4综艺
export default class QueryMoreVideoPage extends BaseFlatListComponent {

    pageSize = 18
    numColumns = 3;

    paramsArray = [];

    contentContainerStyle = { flexDirection: 'row', flexWrap: 'wrap' }

    static navigationOptions = options => {
        return {
            title: options.navigation.state.params.title
        }
    }

    _initListState() {
        return {
            classData: null,
        }
    }

    componentDidMount() {
        // let url = `/api/app/video/ver2/video/queryClassifyList/2/7?videoType=${this.props.navigation.state.params.id}`
        // axios.get(url).then(res => {
        //     for (let i = 0; i < res.data.data.length; i++) {
        //         let childList = res.data.data[i].childList;
        //         this.paramsArray.push(""); //默认为全部
        //         childList = childList.splice(0, 0, { classifyName: res.data.data[i].classifyName, id: "", selected: true })
        //     }
        //     //flag 1 最多播放 2最近更新 3最多喜欢 5最高评分
        //     res.data.data.push({
        //         childList: [
        //             { classifyName: '最多播放', id: 1 ,selected:true},
        //             { classifyName: '最近更新', id: 2 ,selected:false},
        //             { classifyName: '最多喜欢', id: 3 ,selected:false},
        //             { classifyName: '最高评分', id: 5 ,selected:false},
        //         ]
        //     })
        //     this.paramsArray.push(1);
        //     this.setState({ classData: res.data.data }, () => super.componentDidMount())
        // }).catch(error => {
        //     console.log('netlog-', error)
        //     super.componentDidMount()
        // })

        setTimeout(() => {
            let res = {data:data.ClassTypes}
            for (let i = 0; i < res.data.data.length; i++) {
                let childList = res.data.data[i].childList;
                this.paramsArray.push(""); //默认为全部
                childList = childList.splice(0, 0, { classifyName: res.data.data[i].classifyName, id: "", selected: true })
            }
            //flag 1 最多播放 2最近更新 3最多喜欢 5最高评分
            res.data.data.push({
                childList: [
                    { classifyName: '最多播放', id: 1 ,selected:true},
                    { classifyName: '最近更新', id: 2 ,selected:false},
                    { classifyName: '最多喜欢', id: 3 ,selected:false},
                    { classifyName: '最高评分', id: 5 ,selected:false},
                ]
            })
            this.paramsArray.push(1);
            this.setState({ classData: res.data.data }, () => super.componentDidMount())
        }, config.delayed);
    }

    getRequestAction(pageIndex, pageSize) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve({data:data.ClassMoreData})
            }, config.delayed);
        })
    }

    enterDetialPage = data => {
        data.videoInfoId = data.id;
        this.props.navigation.navigate("VideoInfoPage", { data })
    }

    getTagName(obj) {
        return obj.tagName == '无标签' ? null : obj.tagName
    }

    _getTagBackgroundColor = tag => {
        if (tag == "抢鲜") {
            return "#573D1B"
        } else if (tag == "1080P") {
            return "#C47F14";
        } else {
            return "red"
        }
    }

    renderHeaderItem(item, index) {
        return item.childList.map((child) => {
            let bgColor = child.selected ? Colors.mainColor : 'white'
            let tvColor = child.selected ? 'white' : 'black'
            return (
                <TouchableOpacity
                    style={{ padding: 5, borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginRight: 10, backgroundColor: bgColor }}
                    onPress={() => {
                        this.paramsArray[index] = child.id;
                        let data = [...this.state.classData]
                        for (let i = 0; i < data[index].childList.length; i++) {
                            let z = data[index].childList[i]
                            z.selected = z == child;
                        }
                        this.setState({ classData: data }, () => {
                            this.onRefresh()
                        })
                    }}
                    activeOpacity={0.7}>
                    <Text style={{ color: tvColor }}>{child.classifyName}</Text>
                </TouchableOpacity>
            );
        })
    }

    renderFlatViewHeader = () => {
        if (!this.state.classData) return null;
        let views = this.state.classData.map((item, index) => {
            return (
                <ScrollView
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    contentContainerStyle={{ alignItems: 'center' }}
                    style={{marginTop:5, paddingLeft: 10 }}>
                    {this.renderHeaderItem(item, index)}
                </ScrollView>
            )
        })
        return (
            <View>
                {views}
            </View>
        )
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        let obj = rowData;
        let index = rowID + 1;
        let style = index % 3 == 2 ? {
            marginHorizontal: 5,
            width: itemWidth,
            alignItems: 'center',
            marginTop: 10,
        } : {
                width: itemWidth,
                alignItems: 'center',
                marginTop: 10,
            }
        let tagName = obj.tagName == '无标签' ? null : obj.tagName
        let tagBackgroundColor = this._getTagBackgroundColor(tagName)
        let complete = obj.episodeState == 1;
        let updateTag;
        if (complete) {
            if (obj.episodeUploadCount > 1) {
                updateTag = "已完结";
            }
        } else {
            updateTag = obj.episodeUploadCount > 1 ? obj.type != 4 ? `更新至${obj.episodeUploadCount}集` : `更新至${obj.episodeUploadCount}期` : null;
        }
        let image = obj.coverUrl ? { uri: obj.coverUrl } : require('../../source/image/nor.png')
        let playCount = parseInt(obj.playCount)
        if (playCount > 10000) {
            playCount = (playCount / 10000).toFixed(1) + '万'
        }
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.enterDetialPage(obj)}
                style={style}>
                <View style={finalStyle}>
                    <Image style={finalStyle} resizeMode="cover" source={image}></Image>
                    {tagName ? (
                        <View style={{ position: 'absolute', borderRadius: 2, backgroundColor: tagBackgroundColor, top: 5, right: 5, paddingHorizontal: 5 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>{tagName}</Text>
                        </View>
                    ) : null}
                    {updateTag ? (
                        <View style={{ position: 'absolute', width: '100%', bottom: 0, paddingVertical: 5, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>{updateTag}</Text>
                        </View>
                    ) : null}
                </View>
                <View style={{ paddingVertical: 5 }}>
                    <Text numberOfLines={1} style={{ textAlign: 'center' }}>{obj.title}</Text>
                    <Text numberOfLines={1} style={{ textAlign: 'center' }}>{playCount} 播放</Text>
                </View>
            </TouchableOpacity>
        )
    }
}
