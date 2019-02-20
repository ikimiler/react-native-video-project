import React from 'react'
import { View, Text, TouchableOpacity ,PanResponder} from 'react-native'
import { compose } from 'redux';

export class TestPage extends React.Component {

    static navigationOptions = options => {
        return {
            drawerLabel: 'test'
        }
    }

    constructor(props){
        super(props)

        this.panResponder = PanResponder.create({
            onMoveShouldSetPanResponder:(e,gestureState) => {
                console.log('netlog-onMoveShouldSetPanResponder')
                return true;
            },
            onStartShouldSetPanResponder:(e,gestureState) => {
                console.log('netlog-onStartShouldSetPanResponder')

                return true;
            },
            onPanResponderGrant:(e,gestureState) => {
                console.log('netlog-onPanResponderGrant')

            },
            onPanResponderMove:(e,gestureState) => {
                console.log('netlog-onPanResponderMove',e.nativeEvent.pageX,e.nativeEvent.pageY)

            },
        })
    }

    render() {
        return <View
            {...this.panResponder.panHandlers}
            style={{ flex: 1, backgroundColor: 'red' }}>

        </View>
    }
}

export class TestTwoPage extends React.Component {

    static navigationOptions = options => {
        return {
            drawerLabel: 'test'
        }
    }

    render() {
        return <Text>22222222</Text>
    }
}