import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Colors from '../utils/Colors'
import data from '../../data.json'
import config from '../../config.json'

export default class SearchInfoPage extends BaseFlatListComponent {

    enbaleRefresh = false;

    static navigationOptions = options => {
        return {
            title: options.navigation.state.params.key
        }
    }

    filterResponse(result) {
        return result.data.data.map(item => {
            item.title = item.title.replace(/{/g, "").replace(/}/g, "").replace(/，/g, "");
            return item;
        })

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

    _getTagBackgroundColor = tag => {
        if(tag == "抢鲜"){
            return "#573D1B"
        }else if(tag == "1080P"){
            return "#C47F14";
        }else{
            return "red"
        }
    }

    renderRow = rowdata => {
        let tagName = rowdata.tagName == '无标签' ? null : rowdata.tagName
        let tagBackgroundColor = this._getTagBackgroundColor(tagName)
        let complete = rowdata.episodeState == 1;
        let updateTag;
        if(complete){
            if(rowdata.episodeUploadCount > 1){
                updateTag = "已完结";
            }
        }else{
            updateTag = rowdata.episodeUploadCount > 1 ? rowdata.type != 4 ? `更新至${rowdata.episodeUploadCount}集` : `更新至${rowdata.episodeUploadCount}期` : null;
        }        
        let image = rowdata.coverUrl ? {uri : rowdata.coverUrl} : require('../../source/image/nor.png')
        let playCount = parseInt(rowdata.playCount)
        if(playCount > 10000){
            playCount = (playCount / 10000).toFixed(1) + '万'
        }
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.enterDetialPage(rowdata)}
                style={styles.itemStyle}>
                <View style={{ width: 120, height: 80 }}>
                    <Image style={{width: 120, height: 80 }} resizeMode="cover" source={image}></Image>
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
                <View style={{ flex: 1, height: 80, justifyContent: 'space-between', marginLeft: 10 }}>
                    <Text numberOfLines={1}>{rowdata.title}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text>播放{playCount}次</Text>
                        <Text style={styles.buttonStyle}>豆瓣: {rowdata.doubanScore > 0 ? rowdata.doubanScore : '6.0'}</Text>
                    </View>
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