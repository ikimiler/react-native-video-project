package com.colavideoapp.reactpackage;

import android.app.Activity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import com.colavideoapp.utils.RomUtils;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;

public class AppModule extends ReactContextBaseJavaModule {

    public AppModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AppModule";
    }

    @ReactMethod
    public void getLightStatausBarAvailableRomType(Promise promise){
        int lightStatausBarAvailableRomType = RomUtils.getLightStatausBarAvailableRomType();
        promise.resolve(lightStatausBarAvailableRomType != RomUtils.AvailableRomType.NA);
    }

    @ReactMethod
    public void setFullScreen(final boolean isFullscreen){
        UiThreadUtil.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                Activity activity = getCurrentActivity();
                if (activity == null) {
                    return;
                }
                Window window = activity.getWindow();
                if(isFullscreen){
                    int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN
                            | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION ;
                    window.setFlags(flag,flag);
                }else{
                    int flag = WindowManager.LayoutParams.FLAG_FULLSCREEN
                            | WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON
                            | WindowManager.LayoutParams.FLAG_TRANSLUCENT_NAVIGATION ;
                    window.clearFlags(flag);
                }
            }
        });
    }

}
