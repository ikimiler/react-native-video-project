一个基于react-native的纯跨平台的影视项目，欢迎大家star

此项目经过线上考验，仅供大家学习参考

### ios端错误统计
![https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144258.png](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144258.png)

### ios运营统计
![https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144313.png](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144313.png)

### android端错误统计
![https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144346.png](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144346.png)

### android运营统计
![https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144336.png](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/TIM%E6%88%AA%E5%9B%BE20190218144336.png)

### 软件截图
![安卓首页](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/index.png)

![ios首页](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/Simulator%20Screen%20Shot%20-%20iPhone%20XR%20-%202019-02-20%20at%2017.32.18.png)

![安卓频道分类](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/classmore.png)

![ios频道分类](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/Simulator%20Screen%20Shot%20-%20iPhone%20XR%20-%202019-02-20%20at%2017.32.02.png)

![安卓播放页](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/info.png)

![ios播放页](https://raw.githubusercontent.com/andmizi/react-native-video-project/master/picture/Simulator%20Screen%20Shot%20-%20iPhone%20XR%20-%202019-02-20%20at%2017.32.41.png)


### 功能要点：
* m3u8视频播放，支持手势快进后退，倍数播放
* m3u8视频缓存(单线程模式)，暂不支持断点续传
* 列表页通用封装
* realm数据库使用
* codepush热更新使用
* react-navigation路由导航
* redux框架

此套代码移除了网络层以及codepush热更新，需要的可以自己配置。

### 运行android：

1. 先安装node，然后安装react-native 命令：npm install -g react-native
2. 在项目根目录执行npm install
2. 在node-modules/react-native-video/android-exoplayer/src/main/java/com/brentvatne/exoplayer/ReactExoplayerView 第 710 行把判断语句去除掉
2. react-native run-android


### 运行ios:
1. 先安装node，然后安装react-native 命令：npm install -g react-native
2. 在项目根目录执行npm install
3. 在node-modules/react-native-video/ios/RCTVideo.m 第394行，加入
`if([uri isEqualToString:@""]){
	return nil;	
}`
3. react-native run-ios

如果编译安卓/ios遇到错误，请提issuess

最后给你们要一个star O(∩_∩)O



