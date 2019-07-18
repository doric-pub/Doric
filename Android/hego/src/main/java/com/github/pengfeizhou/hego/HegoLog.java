package com.github.pengfeizhou.hego;

import android.util.Log;

/**
 * @Description: Android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoLog {
    private static String TAG = Hego.class.getSimpleName();

    public static void d(String suffix, String message) {
        Log.d(TAG + suffix, message);
    }

    public static void w(String suffix, String message) {
        Log.w(TAG + suffix, message);
    }

    public static void e(String suffix, String message) {
        Log.e(TAG + suffix, message);
    }
}
