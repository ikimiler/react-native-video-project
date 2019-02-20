import React from 'react'
import {
    Image,
    View,
    Text,
    TouchableOpacity,
    ScrollView
} from 'react-native'
import BaseComponent from '../components/BaseComponent'
import Swiper from 'react-native-swiper'
import Colors from '../utils/Colors'

import data from '../../data.json'
import config from '../../config.json'

const finalStyle = { width: DEVICE.width, height: DEVICE.width * 0.5 };

//this.props.id 0推荐 1电影 2电视剧 3动漫 4综艺
export default class Banner extends BaseComponent {

    containerStyle = finalStyle;

    state = {
        datas: [],
        classDatas: []
    }

    filterData(data) {
        //过滤掉广告轮播
        return data.filter(item => {
            return item.targetType == 2 && item.videoInfoId != 0;
        })
    }

    initData() {
        setTimeout(() => {
            let result = this.props.id == 0 ? data.RecommendBannerData : (
                this.props.id == 1 ? data.MovieBannerData : (
                    this.props.id == 2 ? data.TVBannerData : (
                        this.props.id == 3 ? data.CartoonBannerData : data.VarietyBannerData
                    )
                )
            )
            this.setState({
                datas: this.filterData(result.data)
            }, () => this.update(this.LOAD_SUCCESS))
        }, config.delayed);
    }

    _enterVideoInfo = data => {
        data.coverUrl = data.thumbnailUrl;
        this.props.navigation.navigate("VideoInfoPage", { data })
    }

    renderComponent() {
        let items = [];
        for (let i = 0; i < this.state.datas.length; i++) {
            let obj = this.state.datas[i];
            let image = obj.thumbnailUrl ? { uri: obj.thumbnailUrl } : require('../../source/image/nor.png')
            let item = (
                <TouchableOpacity
                    key={'banner' + i}
                    onPress={() => this._enterVideoInfo(obj)}
                    activeOpacity={1}>
                    <Image style={finalStyle} source={image} resizeMode="cover"></Image>
                    <View style={{ position: 'absolute', bottom: 0, paddingBottom: 25, paddingTop: 5, paddingLeft: 5, width: '100%', backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <Text
                            numberOfLines={1}
                            style={{ color: 'white', fontWeight: '400', fontSize: 15 }}>{obj.title}</Text>
                    </View>
                </TouchableOpacity>
            );
            items.push(item)
        }
        return (
            <Swiper
                removeClippedSubviews={DEVICE.android ? true : false}
                paginationStyle={{ bottom: 10, justifyContent: 'flex-end', paddingRight: 5 }}
                style={finalStyle}
                width={finalStyle.width}
                height={finalStyle.height}
                loop={true}
                activeDotColor={Colors.mainColor}
                dotColor="white"
                autoplay={true}
                showsPagination={true}>
                {items}
            </Swiper>
        );
    }
}
