
import React from 'react'
import { ScrollView, View, Text, Image, Alert, BackHandler, DeviceEventEmitter } from 'react-native'
import { StackNavigator, TabNavigator, NavigationActions, DrawerNavigator, DrawerItems } from 'react-navigation'
import { HeaderItem } from './src/components/Header'
import Toast from 'react-native-root-toast'
import SplashPage from './src/pages/SplashPage'
import RecommendPage from './src/pages/RecommendPage'
import MoviePage from './src/pages/MoviePage'
import TVPage from './src/pages/TVPage'
import CartoonPage from './src/pages/CartoonPage'
import VarietyPage from './src/pages/VarietyPage'
import SearchPage from './src/pages/SearchPage'
import SearchInfoPage from './src/pages/SearchInfoPage'
import PersonCenterPage from './src/pages/PersonCenterPage'
import HelpPage from './src/pages/HelpPage'
import AboutPage from './src/pages/AboutPage'
import VIPPage from './src/pages/VIPPage'
import VideoInfoPage from './src/pages/VideoInfoPage'
import VideoListPage from './src/pages/VideoListPage'
import MyCollectPage from './src/pages/MyCollectPage'
import QueryMoreVideoPage from './src/pages/QueryMoreVideoPage'
import DownloadPage from './src/pages/DownloadPage'
import OfflineVideoPlayer from './src/pages/OfflineVideoPlayer'
import MainTabNavigatorHeader from './src/views/MainTabNavigatorHeader'

import Colors from './src/utils/Colors'

const TabNav = TabNavigator({
  Recommend: {
    screen: RecommendPage,
    navigationOptions: {
      tabBarLabel: options => {
        return <Text style={{ color: options.tintColor }}>推荐</Text>
      },
      tabBarIcon: options => {
        let img = options.focused ? require('./source/image/main_choice_click.png') : require('./source/image/main_choice.png')
        return <Image source={img}></Image>
      },
      tabBarOnPress: obj => {
        DeviceEventEmitter.emit("Recommend");
        obj.jumpToIndex(obj.scene.index)
      },
    }
  },
  Movie: {
    screen: MoviePage,
    navigationOptions: {
      tabBarLabel: options => {
        return <Text style={{ color: options.tintColor }}>电影</Text>
      },
      tabBarIcon: options => {
        let img = options.focused ? require('./source/image/main_movie_click.png') : require('./source/image/main_movie.png')
        return <Image source={img} ></Image>
      },
      tabBarOnPress: obj => {
        DeviceEventEmitter.emit("Movie");
        obj.jumpToIndex(obj.scene.index)
      },
    }
  },
  TV: {
    screen: TVPage,
    navigationOptions: {
      tabBarLabel: options => {
        return <Text style={{ color: options.tintColor }}>电视剧</Text>
      },
      tabBarIcon: options => {
        let img = options.focused ? require('./source/image/main_tv_click.png') : require('./source/image/main_tv.png')
        return <Image source={img} ></Image>
      },
      tabBarOnPress: obj => {
        DeviceEventEmitter.emit("TV");
        obj.jumpToIndex(obj.scene.index)
      },
    }
  },
  Cartoon: {
    screen: CartoonPage,
    navigationOptions: {
      tabBarLabel: options => {
        return <Text style={{ color: options.tintColor }}>动漫</Text>
      },
      tabBarIcon: options => {
        let img = options.focused ? require('./source/image/icon_cartoon_nor_click.png') : require('./source/image/icon_cartoon_nor.png')
        return <Image source={img} ></Image>
      },
      tabBarOnPress: obj => {
        DeviceEventEmitter.emit("Cartoon");
        obj.jumpToIndex(obj.scene.index)
      },
    }
  },
  Variety: {
    screen: VarietyPage,
    navigationOptions: {
      tabBarLabel: options => {
        return <Text style={{ color: options.tintColor }}>综艺</Text>
      },
      tabBarIcon: options => {
        let img = options.focused ? require('./source/image/icon_variety_nor_click.png') : require('./source/image/icon_variety_nor.png')
        return <Image source={img} ></Image>
      },
      tabBarOnPress: obj => {
        DeviceEventEmitter.emit("Variety");
        obj.jumpToIndex(obj.scene.index)
      },
    }
  },
  // VIP: {
  //   screen: VIPPage,
  //   navigationOptions: {
  //     tabBarLabel: options => {
  //       return <Text style={{ color: options.tintColor }}>神秘大片</Text>
  //     },
  //     tabBarIcon: options => {
  //       let img = options.focused ? require('./source/image/main_tv_click.png') : require('./source/image/main_tv.png')
  //       return <Image style={{ width: dp(55), height: dp(55) }} source={img} resizeMode="cover"></Image>
  //     },
  //   }
  // }
}, {
    tabBarPosition: 'bottom',
    lazy: true,
    swipeEnabled: false,
    animationEnabled: false,
    initialRouteName: "Recommend",
    removeClippedSubviews: DEVICE.android ? true : false,
    tabBarOptions: {
      activeTintColor: Colors.mainColor,
      inactiveTintColor: Colors.mainColor,
      showIcon: true,
      showLabel: true,
      style: {
        backgroundColor: 'white',
        elevation: 5,
      },
      indicatorStyle: {
        height: 0
      }
    }
  });

const RootNav = StackNavigator({
  Splash: {
    screen: SplashPage,
    navigationOptions: {
      header: null
    }
  },
  Root: {
    screen: TabNav,
    navigationOptions: function (options) {
      return {
        header: null,
        headerLeft: null
      }
    }
  },
  VideoInfoPage: {
    screen: VideoInfoPage,
    navigationOptions: {
      header: null
    }
  },
  VideoListPage: {
    screen: VideoListPage,
  },
  SearchPage: {
    screen: SearchPage,
    navigationOptions: {
      header: null
    }
  },
  SearchInfoPage: {
    screen: SearchInfoPage,
  },
  PersonCenterPage: {
    screen: PersonCenterPage,
    navigationOptions: {
      header: null
    }
  },
  HelpPage: {
    screen: HelpPage,
    navigationOptions: {
      title: "新手帮助"
    }
  },
  AboutPage: {
    screen: AboutPage,
    navigationOptions: {
      title: "关于我们"
    }
  },
  MyCollectPage: {
    screen: MyCollectPage,
    navigationOptions: {
      title: "我的收藏"
    }
  },
  QueryMoreVideoPage: {
    screen: QueryMoreVideoPage,
  }, 
  DownloadPage:{
    screen:DownloadPage,
    navigationOptions : {
      title: "下载中心"
    }
  },
  OfflineVideoPlayer:{
    screen:OfflineVideoPlayer,
    navigationOptions : {
      header: null
    }
  },
}, {
    initialRouteName: "Splash",
    cardStyle: {
    },
    navigationOptions: function (options) {
      return {
        headerLeft: <HeaderItem onClick={() => options.navigation.goBack()}><Image source={require('./source/icons/back_icon.png')}></Image></HeaderItem>
      }
    }
  });

const defaultStateAction = RootNav.router.getStateForAction;
RootNav.router.getStateForAction = (action, state) => {
  if (DEVICE.android && state && action.type === NavigationActions.BACK && state.routes.length === 1) {
    Alert.alert('提示', '确定要退出吗?', [{ text: '取消', onPress: () => { } },
    {
      text: '退出', onPress: () => {
        BackHandler.exitApp();
      }
    }]);
    const routes = [...state.routes];
    return {
      ...state,
      ...state.routes,
      index: routes.length - 1,
    };
  } else {
    return defaultStateAction(action, state);
  }
};



import { TestPage } from './src/TestPage'

export default RootNav;


