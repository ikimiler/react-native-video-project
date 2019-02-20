import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native'

/**
 * options:{key:str,value:str,hasArrow:boolean,hasLine:boolean}
 */
export default class SettingItem extends React.Component {

    render() {
        let { options, onClick } = this.props;
        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={onClick}
                style={[styles.container,this.props.style]}>
                <Text style={{ color: 'black', fontSize: 15}}>{options.key}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>{options.value}</Text>
                    {options.hasArrow ? (
                        <Image
                            style={{ width: 15, height: 15 }}
                            resizeMode='contain'
                            source={require('../../source/image/detailspage_go.png')}>
                        </Image>
                    ) : null}
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 45,
        backgroundColor:'white'
    }
})