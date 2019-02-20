import {Dimensions,PixelRatio,StatusBar,Platform} from 'react-native'

// 设备的像素密度，例如：
//  PixelRatio.get() === 1          mdpi Android 设备 (160 dpi)
//  PixelRatio.get() === 1.5        hdpi Android 设备 (240 dpi)
//  PixelRatio.get() === 2          iPhone 4, 4S,iPhone 5, 5c, 5s,iPhone 6,xhdpi Android 设备 (320 dpi)
//  PixelRatio.get() === 3          iPhone 6 plus , xxhdpi Android 设备 (480 dpi)

export const window = Dimensions.get("window")
export const screen= Dimensions.get("screen")

const defaultWidth = 1080,defaultHeight = 1920,defaultRatio = 3;

//px to dp
const w2 = defaultWidth / defaultRatio;
const h2 = defaultHeight / defaultRatio;

//获取缩放比例
const scale = Math.min(window.height / h2, window.width / w2);

function dp(number){
    let size = Math.round(number * scale + 0.5) / defaultRatio;
    return size
}

// iPhoneX Xs
const X_WIDTH = 375;
const X_HEIGHT = 812;

// iPhoneXR XsMax
const XR_WIDTH = 414;
const XR_HEIGHT = 896;

// screen
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
 
//判断是否为iphoneX或Xs
function isIphoneX() {
    return (
        Platform.OS === 'ios' && 
        ((SCREEN_HEIGHT === X_HEIGHT && SCREEN_WIDTH === X_WIDTH) || 
        (SCREEN_HEIGHT === X_WIDTH && SCREEN_WIDTH === X_HEIGHT))
    )
}

//判断是否为iphoneXR或XsMAX
function isIphoneXR() {
    return (
        Platform.OS === 'ios' && 
        ((SCREEN_HEIGHT === XR_HEIGHT && SCREEN_WIDTH === XR_WIDTH) || 
        (SCREEN_HEIGHT === XR_WIDTH && SCREEN_WIDTH === XR_HEIGHT))
    )
}

global.dp = dp;
global.DEVICE = {
    width:window.width,
    height:window.height,
    screenWidth: Platform.OS == 'ios'? window.width : screen.width,
    screenHeight:Platform.OS == 'ios'? window.height : screen.height,
    StatusBarHeight: StatusBar.currentHeight,
    android:Platform.OS === 'android',
    ios:Platform.OS == 'ios',
    isIphoneX:isIphoneX() | isIphoneXR(),
}
