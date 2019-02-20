import React from 'react'
import {
    Text,
    View,
    Image,
    TouchableOpacity,
    StyleSheet
} from 'react-native'
import BaseFlatListComponent from '../components/BaseFlatListComponent'
import Colors from '../utils/Colors'
import { queryAllCollectVideo } from '../utils/DButils'


export default class MyCollectPage extends BaseFlatListComponent {

    enbaleRefresh = false;
    enableLoadMore = false;

    filterResponse(data) {
        return Object.keys(data).map(key => data[key])
    }

    getRequestAction(pageIndex, pageSize) {
        return queryAllCollectVideo();
    }

    _onBack = () => {
        this.initData();
    }

    enterDetialPage = data => {
        this.props.navigation.navigate("VideoInfoPage", { data,onBack: this._onBack  })
    }

    _getTagBackgroundColor = tag => {
        if (tag == "抢鲜") {
            return "#573D1B"
        } else if (tag == "1080P") {
            return "#C47F14";
        } else {
            return "red"
        }
    }

    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        let tagName = rowData.tagName == '无标签' ? null : rowData.tagName
        let tagBackgroundColor = this._getTagBackgroundColor(tagName)
        let image = rowData.coverUrl ? { uri: rowData.coverUrl } : require('../../source/image/nor.png')

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => this.enterDetialPage(rowData)}
                style={styles.itemStyle}>
                <View style={{ width: 120, height: 80 }}>
                    <Image style={{ width: 120, height: 80 }} resizeMode="cover" source={image}></Image>
                    {tagName ? (
                        <View style={{ position: 'absolute', borderRadius: 2, backgroundColor: tagBackgroundColor, top: 5, right: 5, paddingHorizontal: 5 }}>
                            <Text style={{ color: 'white', fontSize: 12 }}>{tagName}</Text>
                        </View>
                    ) : null}
                </View>
                <Text style={{ alignSelf: 'flex-start', marginLeft: 10 ,flex:1}} numberOfLines={3}>{rowData.title}</Text>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    itemStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        height: 100,
    }
})