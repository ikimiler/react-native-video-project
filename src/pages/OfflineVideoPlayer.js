import React from 'react'
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Share, ListView, NativeModules } from 'react-native'
import BaseComponent from '../components/BaseComponent'
import VideoWrapper from '../views/VideoWrapper'
import { writeHistoryVideo, queryCollectVideo, deleteCollectVideo, writeCollectVideo } from '../utils/DButils'
import Colors from '../utils/Colors'
import Toast from 'react-native-root-toast'
import DownloadManager from '../utils/DownloadManager'
import Loadding from '../components/Loadding'


export default class OfflineVideoPlayer extends BaseComponent {

    state = {
        data: null,
    }

    initData(){
        let item = this.props.navigation.state.params.data;
        this.setState({data:item},() => this.update(this.LOAD_SUCCESS))
    }

    _renderHeader() {
        let item = this.state.data;
        if(!item) return null;

        return (
            <VideoWrapper
                item={item}
                navigation={this.props.navigation}
                onProgress={options => this.progressOption = options}
                onLoad={data => {
                    
                }}
                onEnd={() => {
                    
                }} />
        )
    }

    renderComponent() {
        let data = this.state.data;
        let playCount = parseInt(data.playCount)
        if (playCount > 10000) {
            playCount = (playCount / 10000).toFixed(1) + '万'
        }
        let title = data.title + (data.index > 0 ? ` 第${data.index}集` : "")

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
                    <Text style={[styles.itemStyle, { fontSize: 18, color: 'black' }]}>{title}</Text>
                    <View style={styles.itemBetweenStyle}>
                        <Text>播放: {playCount}次</Text>
                        <Text style={[styles.buttonStyle, { backgroundColor: Colors.mainColor }]}>豆瓣: {data.imdbScore > 0 ? data.imdbScore : '6.0'}</Text>
                    </View>
                    <Text style={styles.itemStyle}>分类: {data.classifyTypeListValue}</Text>
                    <Text style={styles.itemStyle}>导演: {data.director}</Text>
                    <Text style={styles.itemStyle}>演员: {data.staring}</Text>
                    <Text style={styles.itemStyle}>简介: </Text>
                    <Text style={[styles.itemStyle, { marginTop: 10 }]}>      {data.intro}</Text>
                </ScrollView>
            </View>
        );
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