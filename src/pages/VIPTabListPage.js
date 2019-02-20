import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'

const itemWd = Math.floor((DEVICE.width - 10) / 3);
const ItemHd = Math.floor(itemWd * 1.3)

export default class VIPTabListPage extends BaseFlatListComponent {

    pageSize = 18
    numColumns = 3;

    getRequestAction(pageIndex, pageSize) {
        let id = this.props.id;
        let url =`/api/app/video/ver2/video/clickColumnMore_page/2/7?currentPage=${pageIndex}&pageSize=${pageSize}&modelName=4&columnId=${id}`
        return axios.get(url);
    }

    enterDetialPage = data => {
        data.videoInfoId = data.id;
        this.props.navigation.navigate("VideoInfoPage", { data})
    }

    renderRow = item => {
        let data = item.item;
        let index = item.index + 1;
        let style = index % 3 == 2 ? {
            marginHorizontal: 5,
            width: itemWd,
            alignItems: 'center'
        } : {
                width: itemWd,
                alignItems: 'center'
            }
        return (
            <TouchableOpacity activeOpacity={0.7} onPress={() => this.enterDetialPage(data)} style={style}>
                <Image
                    style={styles.imageStyle}
                    resizeMode="cover"
                    source={{ uri: data.coverUrl }}></Image>
                <View style={{ paddingVertical: 10}}>
                    <Text numberOfLines={1} style={{textAlign:'center'}}>{data.title}</Text>
                    <Text numberOfLines={1} style={{textAlign:'center'}}>{data.playCount} 播放</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        width: itemWd,
        height: ItemHd
    }
})