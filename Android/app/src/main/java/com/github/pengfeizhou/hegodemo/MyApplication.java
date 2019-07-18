package com.github.pengfeizhou.hegodemo;

import android.app.Application;

import com.github.pengfeizhou.hego.Hego;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Hego.init(this);
    }
}
