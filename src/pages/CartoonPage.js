import React from 'react'
import { DeviceEventEmitter } from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Banner from '../views/Banner'
import ListItem from '../views/ListItem'
import MainTabNavigatorHeader from '../views/MainTabNavigatorHeader'
import data from '../../data.json'
import config from '../../config.json'

export default class CartoonPage extends BaseFlatListComponent {

    pageSize = 4;

    _renderHeader() {
        return <MainTabNavigatorHeader
            onRightClick={() => {
                this.props.navigation.navigate('QueryMoreVideoPage', { id: 3, title: '动漫' })
            }}
            rightIcon={require('../../source/image/sx_icon.png')}
            navigation={this.props.navigation} />
    }

    getRequestAction(pageIndex, pageSize) {
        return new Promise((resolve,reject) => {
            setTimeout(() => {
                resolve({data:data.CartoonPageData})
            }, config.delayed);
        })
    }

    filterResponse(result) {
        return result.data.data;
    }

    renderFlatViewHeader = () => {
        return <Banner id={3} navigation={this.props.navigation}></Banner>
    }

    renderRow = rowData => {
        return (
            <ListItem navigation={this.props.navigation} data={rowData}></ListItem>
        );
    }
}