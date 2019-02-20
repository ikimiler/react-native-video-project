import React from 'react'
import { Text } from 'react-native'
import BaseComponent from '../components/BaseComponent';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import Colors from '../utils/Colors'
import VIPTabListPage from './VIPTabListPage'

export default class VIPPage extends BaseComponent {

    state = {
        data: []
    }

    initData(pageIndex, pageSize) {
        let url = "/api/app/video/ver2/video/queryColumnDataSmall/2/7?modelName=4"
        axios.get(url).then(res => {
            let data = res.data
            if (data.success) {
                if (data.data && data.data.length) {
                    this.setState({ data: data.data }, () => this.update(this.LOAD_SUCCESS))
                } else {
                    this.update(this.LOAD_EMPTY)
                }
            } else {
                this.update(this.LOAD_FAILED)
            }
        }).catch(error => {
            console.log('netlog-', error)
            this.update(this.LOAD_FAILED)
        })
    }

    _renderPages = () => {
        return this.state.data.map(item => {
            return (
                <VIPTabListPage
                    navigation={this.props.navigation}
                    tabLabel={item.title}
                    id={item.columnId}>
                </VIPTabListPage>
            );
        })
    }

    renderComponent() {
        return (
            <ScrollableTabView
                renderTabBar={() =>
                    <DefaultTabBar
                        tabStyle={{ backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}
                        underlineStyle={{ backgroundColor: 'transparent', height: 0 }}
                    />
                }
                locked={true}
                tabBarPosition='top'
                tabBarTextStyle={{
                    fontSize: DEVICE.ios_OS ? 17 : 20,
                    fontWeight: DEVICE.ios_OS ? '600' : '500',
                }}
                tabBarActiveTextColor={Colors.mainColor}
                ref={(tabView) => { this.tabView = tabView }}>

                {this._renderPages()}

            </ScrollableTabView>
        );
    }
}