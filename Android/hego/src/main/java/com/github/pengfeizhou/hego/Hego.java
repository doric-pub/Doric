package com.github.pengfeizhou.hego;

import android.app.Application;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class Hego {
    private static Application sApplication;

    public static void init(Application application) {
        sApplication = application;
    }

    public static Application application() {
        return sApplication;
    }
}
