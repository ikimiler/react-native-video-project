import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import Header, { HeaderItem } from '../components/Header'


export default class MainTabNavigatorHeader extends React.Component {

    _enterSearchPage = () => {
        this.props.navigation.navigate('SearchPage')
    }

    render() {
        return (
            <Header>
                <HeaderItem onClick={() => this.props.navigation.navigate('PersonCenterPage')}>
                    <Image source={require('../../source/image/main_my.png')}></Image>
                </HeaderItem>
                <TouchableOpacity
                    onPress={this._enterSearchPage}
                    activeOpacity={1}
                    style={[{ flex: 1, height: 35, borderRadius: 5, backgroundColor: 'rgba(0,0,0,0.1)', justifyContent: 'center', alignItems: 'center' },this.props.centerStyle]}>
                    <Text>搜一搜，全都有</Text>
                </TouchableOpacity>
                {this.props.rightIcon && <HeaderItem onClick={() => this.props.onRightClick()}>
                    <Image source={this.props.rightIcon}></Image>
                </HeaderItem>}
            </Header>
        );
    }
}

