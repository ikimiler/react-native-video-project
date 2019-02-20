import React from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    ListView,
    RefreshControl
} from 'react-native';
import BaseComponent from './BaseComponent';
import Colors from '../utils/Colors'

/**
 * 封装列表组件，包含下拉刷新，加载更多等
 * 子类只关心试图层的逻辑
 */
export default class BaseFlatListComponent extends BaseComponent {

    pageIndex = 1; //页码角标
    pageSize = 20; //页码大小
    enableLoadMore = true; //是否开启加载更多功能
    enbaleRefresh = true;
    numColumns = 1;//几列

    refreshingColor = Colors.mainColor;

    contentContainerStyle = {}

    dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    state = {
        datas: [],
        refreshing: false,
        loadMoreStatus: 0,// 0 加载更多中 1加载更多失败 2加载更多数据为空
        ...this._initListState(),
    }

    /**
     * 建议子类不要使用this.state={} 去初始化
     * 需要初始化state的时候，重写这个函数进行初始化
     */
    _initListState() {
        return null;
    }

    /**
     * 需要返回一个对象，{type：type,url:url,params：{}}
     * type 接口请求方式 get / post
     * url 接口路径
     * params 请求参数
     */
    getRequestAction(pageIndex, pageSize) {
        return null;
    }

    /**
     * 过滤接口返回的数据，如一般列表都会返回{data:[]}格式，如果遇到{arrays:[]} 需要重写此方法进行过滤
     * @param {}} result
     */
    filterResponse(result) {
        let arrays = result.data.data;
        if (arrays) {
            return arrays;
        } else {
            arrays = []
            return arrays;
        }
    }

    /**
     * 拉取数据
     */
    initData() {
        let requestAction = this.getRequestAction(this.pageIndex, this.pageSize);
        if (!requestAction) {
            return;
            //throw "must override the getRequestAction() function"
        }

        requestAction.then(res => {
            let arrays = this.filterResponse(res);
            this.enableLoadMore = !(arrays.length < this.pageSize);
            if (this.pageIndex > 1) { //加载更多
                if (arrays.length == 0) {
                    //没有更多数据了 loadMoreStatus:0, //0 加载更多中 1加载更多失败 2加载更多数据为空
                    this.setState({ loadMoreStatus: 2 })
                } else {
                    let oldArrays = this.state.datas;
                    this.setState({
                        datas: [...oldArrays, ...arrays,],
                        loadMoreStatus: arrays.length < this.pageSize ? 2 : 0,
                    });
                }
            } else {
                if (arrays.length == 0) {
                    this.setState({ refreshing: false }, () => this.update(this.LOAD_EMPTY))
                } else {
                    this.setState({
                        datas: [...arrays],
                        refreshing: false,
                        loadMoreStatus: arrays.length < this.pageSize ? 2 : 0,
                    }, () => this.update(this.LOAD_SUCCESS))
                }
            }
        }).catch(error => {
            console.log('netlog-', error)
            if (this.pageIndex == 1) {
                this.setState({ refreshing: false }, () => this.update(this.LOAD_FAILED))
            } else {
                this.setState({
                    loadMoreStatus: 1,
                })
            }
        })
    }

    /**
     * 下拉刷新
     */
    onRefresh = () => {
        if (this.state.refreshing) {
            this.pageIndex = 1;
            this.initData();
        } else {
            this.setState({ refreshing: true }, () => {
                this.pageIndex = 1;
                this.initData();
            })
        }
    }

    /**
     * 加载更多
     */
    loadMore = () => {
        if (this.enableLoadMore && this.state.datas.length >= this.pageSize) {
            this.pageIndex += 1;
            this.initData();
        }
    }

    /**
     * 渲染item 组件，子类需要复写
     * @param {}} item
     */
    renderRow = (rowData, sectionID, rowID, highlightRow) => {
        return null;
    }

    /**
     * 渲染头部
     */
    renderFlatViewHeader = () => {
        return null;
    }

    /**
     * 渲染尾部
     */
    renderFlatViewFooter = () => {
        if (!this.enableLoadMore) return null;
        //0 加载更多中 1加载更多失败 2加载更多数据为空
        let loadMoreStatus = this.state.loadMoreStatus;
        if (loadMoreStatus == 0) {
            return (
                <View style={{ width: DEVICE.width, height: dp(130), justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={Colors.mainColor} />
                    <Text style={{ marginTop: dp(5), color: Colors.mainColor }}>正在加载更多...</Text>
                </View>
            );
        } else if (loadMoreStatus == 1) {
            return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                        this.setState({ loadMoreStatus: 0 }, () => {
                            this.initData();
                        })
                    }}
                    style={{ width: DEVICE.width, height: dp(130), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginTop: dp(5), color: Colors.mainColor }}>加载失败,点击重试</Text>
                </TouchableOpacity>
            );
        } else if (loadMoreStatus == 2) {
            return (
                <View style={{ width: DEVICE.width, height: dp(130), justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginTop: dp(5), color: Colors.mainColor }}>暂无更多数据了</Text>
                </View>
            );
        }
    }

    renderComponent() {
        return (
            <ListView
                ref={ref => this.listview = ref}
                refreshControl={
                    this.enbaleRefresh ?
                        <RefreshControl
                            colors={[this.refreshingColor]}
                            onRefresh={this.onRefresh}
                            refreshing={this.state.refreshing}>
                        </RefreshControl> : null
                }
                contentContainerStyle={this.contentContainerStyle}
                enableEmptySections={true}
                initialListSize={this.pageSize}
                dataSource={this.dataSource.cloneWithRows(this.state.datas)}
                onEndReached={this.loadMore}
                onEndReachedThreshold={10}
                renderRow={this.renderRow}
                renderHeader={this.renderFlatViewHeader}
                renderFooter={this.renderFlatViewFooter}>
            </ListView>
        );
    }
}
