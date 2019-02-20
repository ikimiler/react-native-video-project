import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';
import BaseComponent from '../components/BaseComponent'
import {appBarPaddingTop} from '../components/Header'
import Colors from '../utils/Colors'

const imageBg = require('../../source/image/launch_screen.jpg')

export default class SplashPage extends BaseComponent {

    count = 3;

    state = {
        LOAD_STATE: this.LOAD_SUCCESS,
    }

    hasSafeAreaView = false;

    initData() {
        this.task = setInterval(() => {
            if (this.count == 0) {
                this.props.navigation.replace('Root')
                clearInterval(this.task)
            } else {
                this.count--;
                this.forceUpdate()
            }
        }, 1000);
    }

    renderComponent() {
        return (
            <View style={{ flex: 1 }}>
                <Image
                    source={imageBg}
                    resizeMode='cover'
                    style={{ flex: 1, width: DEVICE.width }}></Image>
                <View style={styles.buttonStyle}>
                    <Text style={{color:'white',fontSize:15}}>{this.count}s</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle: {
        position: 'absolute',
        top:10 + DEVICE.isIphoneX ? 45 : 0,
        right: 15,
        backgroundColor: Colors.mainColor,
        borderRadius: 5,
        paddingHorizontal:20,
        paddingVertical:5,
        justifyContent:'center',
        alignItems:'center'
    }
})