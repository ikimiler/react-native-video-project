import React from 'react'
import {
    Text,
    View,
    Image,
    ScrollView
} from 'react-native'

export default class AboutPage extends React.Component {

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', padding: 10 }}>

                <Text>影视爱好者，为广大网友提供免费的，高质量的影视作品</Text>
                <Text style={{ marginTop: 5 }}>如有侵权，请联系告知～</Text>

            </View>
        )
    }
}