import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'
import Colors from '../utils/Colors';

const itemWidth = Math.floor((DEVICE.width - 10) / 3);
const itemHeight = Math.floor(itemWidth * 1.3)
const finalStyle = { width: itemWidth, height: itemHeight }

export default class ListItem extends React.Component {

    enterDetialPage = data => {
        this.props.navigation.navigate("VideoInfoPage", { data })
    }

    enterViedoListPage = data => {
        this.props.navigation.navigate("VideoListPage", { title: data.title, id: data.id })
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

    render() {
        let data = this.props.data;
        let items = [];
        if (data.queryList) {
            for (let i = 0; i < data.queryList.length; i++) {
                let obj = data.queryList[i];
                let tagName = obj.tagName == '无标签' ? null : obj.tagName
                let tagBackgroundColor = this._getTagBackgroundColor(tagName)
                let complete = obj.episodeState == 1;
                let updateTag;
                if (complete) {
                    if (obj.episodeUploadCount > 1) {
                        updateTag = "已完结";
                    }
                } else {
                    updateTag = obj.episodeUploadCount > 1 ? obj.type != 4 ? `更新至${obj.episodeUploadCount}集` : `更新至${obj.episodeUploadCount}期` : null;
                }
                let style = (i + 1) % 3 == 2 ? { marginHorizontal: 5 } : {};
                let image = obj.coverUrl ? { uri: obj.coverUrl } : require('../../source/image/nor.png')
                let item = (
                    <TouchableOpacity
                        key={'listitem_children' + i}
                        activeOpacity={0.7}
                        style={style}
                        onPress={() => this.enterDetialPage(obj)}>
                        <View style={finalStyle}>
                            <Image style={finalStyle} resizeMode="cover" source={image}></Image>
                            {tagName ? (
                                <View style={{ position: 'absolute', borderRadius: 2, backgroundColor: tagBackgroundColor, top: 5, right: 5, paddingHorizontal: 5 }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{tagName}</Text>
                                </View>
                            ) : null}
                            {updateTag ? (
                                <View style={{ position: 'absolute', width: '100%', bottom: 0, paddingVertical: 5, backgroundColor: 'rgba(0,0,0,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: 'white', fontSize: 12 }}>{updateTag}</Text>
                                </View>
                            ) : null}
                        </View>
                        <Text
                            style={{ width: finalStyle.width, paddingVertical: 10, textAlign: 'center' }}
                            numberOfLines={2}>
                            {obj.title}
                        </Text>
                    </TouchableOpacity>
                );
                items.push(item)
            }
        }

        return (
            <View style={{ backgroundColor: 'white' }}>
                <View style={styles.itemBetweenStyle}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 5, maxWidth: itemWidth * 2 }}>
                        <View style={{ width: 3, height: 15, backgroundColor: Colors.mainColor, marginRight: 5 }}></View>
                        <Text numberOfLines={1} style={styles.title}>{data.title}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.itemBetweenStyle}
                        activeOpacity={0.7}
                        onPress={() => this.enterViedoListPage(data)}>
                        <Text style={[styles.title, { fontSize: 14 }]} >查看更多</Text>
                        <Image
                            resizeMode="contain"
                            style={{ width: 15, height: 15 }}
                            source={require('../../source/image/detailspage_go.png')}></Image>
                    </TouchableOpacity>
                </View>
                <View style={styles.flex}>
                    {items}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    flex: {
        width: DEVICE.width,
        minHeight: finalStyle.height,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    title: {
        color: Colors.mainColor,
        fontSize: 17,
        paddingVertical: 10,
    },
    itemBetweenStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
    },
})