import React, {
    Component,
} from 'react';
import {
    View,
    ActivityIndicator,
    Text
} from 'react-native';
import RootSiblings from 'react-native-root-siblings';

class LoaddingContainer extends Component {

    render() {
        let {message} = this.props;
        return (
            <View style={{position:'absolute',top:0,bottom:0,right:0,left:0,justifyContent:'center',alignItems:'center'}}>
                <View style={{minWidth:100,minHeight:100,borderRadius:5,justifyContent:'center',alignItems:'center',backgroundColor:'#000000',opacity:0.8}}>
                    <ActivityIndicator size="large" color='white' />
                    <Text style={{marginTop:10,color:'white'}}>{message}</Text>
                </View>
            </View>
        )
    }
}

export default class Loadding {

    static show = (message = "努力加载中...") => {
        return new RootSiblings(<LoaddingContainer message={message}></LoaddingContainer>);
    };

    static hide = obj => {
        if (obj instanceof RootSiblings) {
            obj.destroy();
        } else {
            console.warn(`Toast.hide expected a \`RootSiblings\` instance as argument.\nBut got \`${typeof obj}\` instead.`);
        }
    };
}
