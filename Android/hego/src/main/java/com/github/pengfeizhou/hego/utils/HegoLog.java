package com.github.pengfeizhou.hego.utils;

import android.util.Log;

import com.github.pengfeizhou.hego.Hego;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoLog {
    private static String TAG = Hego.class.getSimpleName();

    public static void d(String message, String... suffix) {
        StringBuilder stringBuilder = new StringBuilder(TAG);
        for (String s : suffix) {
            stringBuilder.append(s);
        }
        Log.d(stringBuilder.toString(), message);
    }

    public static void w(String message, String... suffix) {
        StringBuilder stringBuilder = new StringBuilder(TAG);
        for (String s : suffix) {
            stringBuilder.append(s);
        }
        Log.w(stringBuilder.toString(), message);
    }

    public static void e(String message, String... suffix) {
        StringBuilder stringBuilder = new StringBuilder(TAG);
        for (String s : suffix) {
            stringBuilder.append(s);
        }
        Log.e(stringBuilder.toString(), message);
    }
}
