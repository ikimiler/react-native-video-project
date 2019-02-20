import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Share,
    ImageBackground,
    StatusBar,
    Alert
} from 'react-native'
import BaseComponent from '../components/BaseComponent'
import SetingItem from '../views/SettingItem'
import { queryAllHistoryVideo, clearAllHistoryVideo } from '../utils/DButils'
import { HeaderItem, appBarPaddingTop } from '../components/Header'
import Toast from 'react-native-root-toast'
import Colors from '../utils/Colors'

const itemWidth = Math.floor((DEVICE.width - 40) / 4);
const itemHeight = Math.floor(itemWidth * 1.1)
const finalStyle = { width: itemWidth, height: itemHeight }

export default class PersonCenterPage extends BaseComponent {

    state = {
        historyVideo: [],
    }

    initData(){
        queryAllHistoryVideo().then(res => {
            let result = [];
            for(let key in res){
                result.push(res[key])
            }
            this.setState({historyVideo:result},() => this.update(this.LOAD_SUCCESS))
        })
    }

    _onBack = () => {
        this.initData();
    }

    enterDetialPage = data => {
        data.videoInfoId = data.id;
        data.title = data.name;
        data.history = true;
        let params = Object.assign({},data)
        this.props.navigation.navigate("VideoInfoPage", { data:params, onBack: this._onBack })
    }

    _clearAllHistoryVideo = () => {
        clearAllHistoryVideo().then(res => {
            this.setState({historyVideo:[]})
        })
    }

    renderComponent() {
        console.log('netlog-item',this.state.historyVideo.length)
        let historyVideoViews = []
        for (let i = this.state.historyVideo.length - 1; i >= 0; i--) {
            if(historyVideoViews.length >= 30) break;
            let obj = this.state.historyVideo[i + ""];
            console.log('netlog-item',obj)
            let item = (
                <TouchableOpacity
                    key={'history_' + i}
                    activeOpacity={0.7}
                    style={{ marginRight: 10 }}
                    onPress={() => this.enterDetialPage(obj)}>
                    <Image
                        style={[finalStyle]}
                        resizeMode="cover"
                        source={{ uri: obj.coverUrl }}></Image>
                    <Text
                        style={{ width: finalStyle.width, paddingVertical: 5, textAlign: 'center' }}
                        numberOfLines={1}>{obj.name}</Text>
                    <Text
                        style={{ width: finalStyle.width, textAlign: 'center' }}
                        numberOfLines={1}>观看至%{obj.progress}</Text>
                </TouchableOpacity>
            );
            historyVideoViews.push(item)
        }

        let imageheight = DEVICE.width / 1.7;
        return (
            <ScrollView
                contentContainerStyle={{ paddingBottom: 50 }}
                style={{ backgroundColor: "#F1F1F1" }}>
                <ImageBackground
                    source={require('../../source/image/profile_bg.png')}
                    resizeMode='cover'
                    style={{ justifyContent: 'center', width: '100%', height: imageheight, alignItems: 'center', backgroundColor: 'white' }}>
                    {/* <Image source={require('../../source/image/profile_icon.png')}></Image> */}
                    <HeaderItem
                        onClick={() => this.props.navigation.goBack()}
                        style={{ position: 'absolute', left: 0, top: appBarPaddingTop }}>
                        <Image
                            resizeMode='contain'
                            style={{ width: 25, height: 25 }}
                            source={require('../../source/image/player_return.png')}></Image>
                    </HeaderItem>
                </ImageBackground>

                <View style={{ flexDirection: 'row', paddingVertical: 10, backgroundColor: 'white' }}>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            Toast.show('正在努力开发中...')
                        }}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 25, height: 25 }} resizeMode='contain' source={require('../../source/image/icon_mine_vip.png')}></Image>
                        <Text style={{ marginTop: 5, color: 'black' }}>神秘大片</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate("DownloadPage")}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 25, height: 25 }} resizeMode='contain' source={require('../../source/image/down.png')}></Image>
                        <Text style={{ marginTop: 5, color: 'black' }}>下载中心</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => this.props.navigation.navigate('MyCollectPage') }
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 25, height: 25 }} resizeMode='contain' source={require('../../source/image/shoucang.png')}></Image>
                        <Text style={{ marginTop: 5, color: 'black' }}>我的收藏</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            Toast.show('正在努力开发中...')
                        }}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image style={{ width: 25, height: 25 }} resizeMode='contain' source={require('../../source/image/more.png')}></Image>
                        <Text style={{ marginTop: 5, color: 'black' }}>更多功能</Text>
                    </TouchableOpacity>
                </View>

                {historyVideoViews && historyVideoViews.length ? (
                    <View style={{ backgroundColor: 'white', marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10, paddingHorizontal: 10, justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ width: 3, height: 15, backgroundColor: "black" }}></View>
                                <Text style={{ color: 'black', fontSize: 15, marginLeft: 5 }}>播放记录</Text>
                            </View>
                            <Text onPress={this._clearAllHistoryVideo}>清空记录</Text>

                        </View>
                        <ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            contentContainerStyle={{ paddingLeft: 10, paddingBottom: 20 }}>
                            {historyVideoViews}
                        </ScrollView>
                    </View>
                ) : null}

                <SetingItem style={{ marginTop: 10 }} onClick={() => { this.props.navigation.navigate('HelpPage') }} options={{ key: '新手帮助', value: '', hasArrow: true }}></SetingItem>
                <SetingItem
                    onClick={() => {
                        Share.share({
                            title: '来嘻哈影视，看免费高清大片',
                            message: '最新，最全，无广告，请上嘻哈影视 https://github.com/andmizi',
                            url: '最新，最全，无广告，请上嘻哈影视https://github.com/andmizi'
                        })
                    }}
                    options={{ key: '分享给好友', value: '', hasArrow: true }}></SetingItem>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({

})