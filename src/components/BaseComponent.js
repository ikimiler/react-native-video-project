import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    ActivityIndicator,
    TouchableOpacity,
    Text,
    Image,
    SafeAreaView,
} from 'react-native';
import Colors from '../utils/Colors'

/**
 * @author kimi
 * @feature 基类封装
 */
export default class BaseComponent extends Component {

    LOAD_RUN = 0;//加载中
    LOAD_SUCCESS = 1;//加载成功
    LOAD_FAILED = 2;//加载失败
    LOAD_EMPTY = 3;//数据为空

    containerStyle = { flex: 1, backgroundColor: 'white' }

    hasSafeAreaView = true;

    state = {
        LOAD_STATE: this.LOAD_RUN,
    }

    componentDidMount() {
        try {
            this.initData();
        } catch (error) {
            console.log('netlog-', error)
        }
    }

    /**
   * 初始化数据
   */
    initData() {

    }

    /**
     * 更新界面
     */
    update(state, callback = () => { }) {
        if (this.state.LOAD_STATE !== state) {
            this.setState({ LOAD_STATE: state }, callback)
        }
    }

    /**
     * 获取加载状态
     */
    getLoadStates() {
        return this.state.LOAD_STATE;
    }

    /**
     * 渲染具体的内容组件
     */
    renderComponent() {
        return null;
    }

    /**
     * 加载中
     */
    _renderLoadRun() {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={Colors.mainColor} />
                <Text style={{ marginTop: 10, color: Colors.mainColor }}>正在拼命加载中...</Text>
            </View>
        );
    }

    /**
     * 加载失败
     */
    _renderLoadFailed() {
        return (
            <View style={styles.center}>
                <Text style={{ color: Colors.mainColor }}>天啊,加载出现了小问题~</Text>
                <TouchableOpacity style={styles.errorButton} activeOpacity={0.5} onPress={() => {
                    this.update(this.LOAD_RUN);
                    this.initData();
                }}>
                    <Text style={{ color: "white" }}>点击重试</Text>
                </TouchableOpacity>
            </View>
        );
    }


    /**
     * 数据为空
     */
    _renderLoadEmpty() {
        return (
            <View style={styles.center}>
                <Text style={{ color: Colors.mainColor }}>暂时没有相关数据哦~</Text>
            </View>
        );
    }


    /**
     * 渲染加载状态的各种组件
     */
    _renderLoadStateComponents() {
        let state = this.state.LOAD_STATE;
        if (state == this.LOAD_RUN || state == undefined) {//加载中
            return this._renderLoadRun();
        } else if (state == this.LOAD_SUCCESS) {//加载成功
            try {
                return this.renderComponent();
            } catch (error) {
                console.log('netlog-', 'renderComponent have a error : ', error)
                return this._renderLoadFailed();
            }
        } else if (state == this.LOAD_FAILED) {//加载失败
            return this._renderLoadFailed();
        } else if (state == this.LOAD_EMPTY) {//数据为空
            return this._renderLoadEmpty();
        }
    }

    /**
     * 渲染兄弟组件，modal的时候需要重写此方法
     */
    _renderOther() {
        return null;
    }

    _renderOther2() {
        return null;
    }

    _renderHeader() {

    }

    render() {

        let Rootview = this.hasSafeAreaView ? SafeAreaView : View
        return (
            <Rootview style={this.containerStyle}>
                {this._renderHeader()}
                <View style={{flex:1}}>
                    {this._renderLoadStateComponents()}
                    {this._renderOther()}
                    {this._renderOther2()}
                </View>

            </Rootview>
        );
    }
}

const styles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    errorButton: {
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: Colors.mainColor,
        marginTop: 10,
    }
});
