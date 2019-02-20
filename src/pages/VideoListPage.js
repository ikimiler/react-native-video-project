import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import data from '../../data.json'
import config from '../../config.json'

const itemWidth = Math.floor((DEVICE.width - 10) / 3);
const itemHeight = Math.floor(itemWidth * 1.3)
const finalStyle = { width: itemWidth, height: itemHeight }


export default class VideoListPage extends BaseFlatListComponent {

    pageSize = 18
    numColumns = 3;
    enbaleRefresh = false;

    contentContainerStyle = { flexDirection: 'row', flexWrap: 'wrap' }

    static navigationOptions = options => {
        return {
            title: options.navigation.state.params.title
        }
    }

    getRequestAction(pageIndex, pageSize) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve({data:data.MoreData})
            }, config.delayed);
        })
    }

    enterDetialPage = data => {
        this.props.navigation.navigate("VideoInfoPage", { data})
    }

    getTagName(obj) {
        return obj.tagName == '无标签' ? null : obj.tagName
    }

    _getTagBackgroundColor = tag => {
        if(tag == "抢鲜"){
            return "#573D1B"
        }else if(tag == "1080P"){
            return "#C47F14";
        }else{
            return "red"
        }
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
        let updateTag ;
        if(complete){
            if(obj.episodeUploadCount > 1){
                updateTag = "已完结";
            }
        }else{
            updateTag = obj.episodeUploadCount > 1 ? obj.type != 4 ? `更新至${obj.episodeUploadCount}集` : `更新至${obj.episodeUploadCount}期` : null;
        }
        let image = obj.coverUrl ? {uri : obj.coverUrl} : require('../../source/image/nor.png')
        let playCount = parseInt(obj.playCount)
        if(playCount > 10000){
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
