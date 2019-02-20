import React from 'react'
import { DeviceEventEmitter, View,Alert } from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Banner from '../views/Banner'
import ListItem from '../views/ListItem'
import MainTabNavigatorHeader from '../views/MainTabNavigatorHeader'
import data from '../../data.json'
import config from '../../config.json'

export default class Recommend extends BaseFlatListComponent {

    pageSize = 4;
    
    _renderHeader() {
        return <MainTabNavigatorHeader centerStyle={{marginRight:15}} navigation={this.props.navigation} />
    }

    getRequestAction(pageIndex, pageSize) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve({data:data.RecommendPageData})
            }, config.delayed);
        })
    }

    filterResponse(result) {
        return result.data.data;
    }

    renderFlatViewHeader = () => {
        return <Banner id={0} navigation={this.props.navigation}></Banner>
    }

    renderRow = rowData => {
        return (
            <ListItem navigation={this.props.navigation} data={rowData}></ListItem>
        );
    }
}