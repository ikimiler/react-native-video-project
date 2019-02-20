import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView
} from 'react-native'
import Header, { HeaderItem } from '../components/Header'
import BaseComponent from '../components/BaseComponent'
import { writeHistorySearchContent, queryAllHistorySearchContent, clearAllHistorySearchConten } from '../utils/DButils'
import Colors from '../utils/Colors'
import Toast from 'react-native-root-toast'
import data from '../../data.json'
import config from '../../config.json'

const backIcon = require('../../source/icons/back_icon.png')
const itemWidth = (DEVICE.width - 20) / 2;

export default class SearchPage extends BaseComponent {

    state = {
        datas: data.HotSearchData.data,
        historyContents: {},
        content: '',
        LOAD_STATE:this.LOAD_SUCCESS
    }

    initData() {
        this.queryHistoryVideo()
    }

    /**
     * 查询搜索历史记录
     */
    queryHistoryVideo(){
        queryAllHistorySearchContent().then(res => {
            this.setState({historyContents:res})
        })
    }

    enterSearchInfo(key, flag) {
        if (key) {
            if (flag) {
                writeHistorySearchContent(key).then(res => {
                    this.queryHistoryVideo();
                }).catch(error => {
                    console.log("netlog-",error)
                })
            }
            this.props.navigation.navigate('SearchInfoPage', { key })
        }
    }

    _clearAllHistorySearchContens = () => {
        clearAllHistorySearchConten().then(res => {
            this.setState({historyContents:{}})
        })
    }

    _renderHeader() {
        return (
            <Header>
                <HeaderItem onClick={() => this.props.navigation.goBack()}>
                    <Image source={backIcon}></Image>
                </HeaderItem>
                <TextInput
                    autoFocus={true}
                    numberOfLines={1}
                    onChangeText={text => this.setState({ content: text })}
                    maxLength={20}
                    placeholder="搜一搜,全都有"
                    returnKeyType="search"
                    onSubmitEditing={e => this.enterSearchInfo(e.nativeEvent.text,true)}
                    underlineColorAndroid='transparent'
                    style={{ flex: 1, height: 35, padding: 0, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                </TextInput>
                <HeaderItem onClick={() => this.enterSearchInfo(this.state.content, true)}>
                    <Text style={{ fontSize: 15, color: 'black', fontWeight: 'bold' }}>搜索 </Text>
                </HeaderItem>
            </Header>
        );
    }

    renderComponent() {
        let keys = []
        keys = Object.keys(this.state.historyContents).reverse();
        keys.splice(10, keys.length);
        let showHistoryContents = keys.length > 0
       
        return (
            <ScrollView contentContainerStyle={{ padding: 10 }}>
                {
                    showHistoryContents ? (
                        <View style={{ marginBottom: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 3, height: 15, backgroundColor: 'black' }}></View>
                                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 5 }}>历史搜索</Text>
                                </View>
                                <Text onPress={this._clearAllHistorySearchContens}>清空记录</Text>
                            </View>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', }}>
                                {
                                    keys.map((key, index) => {
                                        let item = this.state.historyContents[key]
                                        return (
                                            <Text
                                                key={'search_children_' + index}
                                                onPress={() => this.enterSearchInfo(item.name, true)}
                                                numberOfLines={1}
                                                style={{ fontSize: 15, margin: 5, padding: 5, color: 'white', backgroundColor: Colors.mainColor, borderRadius: 4 }}>{item.name}
                                            </Text>
                                        );
                                    })
                                }
                            </View>
                        </View>
                    ) : null
                }

                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <View style={{ width: 3, height: 15, backgroundColor: 'black' }}></View>
                    <Text style={{ color: 'black', fontSize: 15, marginLeft: 5 }}>热门搜索</Text>
                </View>
                <View style={styles.container}>
                    {
                        this.state.datas.map((item) => {
                            return (
                                <TouchableOpacity
                                    key={'search_' + item.id}
                                    style={{ width: itemWidth, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}
                                    onPress={() => this.enterSearchInfo(item.keyword, false)}
                                    activeOpacity={0.7}>
                                    <Text style={{ fontSize: 15 }}>{item.orderNum} </Text>
                                    <Text numberOfLines={1} style={{ fontSize: 15, marginLeft: 5 }}>{item.keyword}</Text>
                                </TouchableOpacity>
                            );
                        })
                    }
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    }
})