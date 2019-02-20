import React from 'react'
import {
    View,
    TouchableNativeFeedback,
    TouchableOpacity,
    Dimensions,
    Platform,
    SafeAreaView,
    StyleSheet,
    StatusBar
} from 'react-native'

const { width, height } = Dimensions.get('window')

//适配android 状态栏
const androidOS = Platform.OS === 'android'
const IOS = Platform.OS === 'ios'

// export var appBarPaddingTop = (androidOS && Platform.Version >= 19) ? StatusBar.currentHeight : 0;
export var appBarPaddingTop = 0;
export var appBarHeight = IOS ? 44 : 56 + appBarPaddingTop;

export default class Header extends React.Component {

    render() {
        return (
            <SafeAreaView style={[{ backgroundColor: 'white', elevation: 5 }, this.props.safeStyle]}>
                <View style={[styles.toolbarStyle, this.props.style]}>
                    {this.props.children}
                </View>
            </SafeAreaView>
        );
    }
}


export class HeaderItem extends React.Component {

    render() {
        let TargetComponent = androidOS ? TouchableNativeFeedback : TouchableOpacity

        let background = {};
        if(androidOS){
            if (Platform['Version'] >= 21) {
                background.background = TouchableNativeFeedback.Ripple('rgba(0, 0, 0, .32)', true)
            } else {
                background.background = TouchableNativeFeedback.SelectableBackground();
            }
        }

        return (
            <View style={[styles.headerItemStyle, this.props.style]}>
                <TargetComponent
                    {...background}
                    onPress={this.props.onClick}>
                    <View style={{ padding: 3 }}>
                        {this.props.children}
                    </View>
                </TargetComponent>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    toolbarStyle: {
        width,
        height: appBarHeight,
        paddingTop: appBarPaddingTop,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    headerItemStyle: {
        width: appBarHeight - appBarPaddingTop,
        height: appBarHeight - appBarPaddingTop,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContentStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitleStyle: {
        fontSize: IOS ? 17 : 20,
        fontWeight: IOS ? '600' : '500',
        color: 'rgba(0, 0, 0, .9)',
    }
})