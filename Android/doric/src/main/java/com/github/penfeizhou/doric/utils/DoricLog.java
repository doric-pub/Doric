package com.github.penfeizhou.doric.utils;

import android.text.TextUtils;
import android.util.Log;

import com.github.penfeizhou.doric.Doric;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricLog {
    private static String TAG = Doric.class.getSimpleName();


    public static void d(String message, Object... args) {
        Log.d(suffixTag(null), format(message, args));
    }

    public static void w(String message, Object... args) {
        Log.w(suffixTag(null), format(message, args));

    }

    public static void e(String message, Object... args) {
        Log.e(suffixTag(null), format(message, args));
    }

    public static void suffix_d(String suffix, String message, Object... args) {
        Log.d(suffixTag(suffix), format(message, args));
    }

    public static void suffix_w(String suffix, String message, Object... args) {
        Log.w(suffixTag(suffix), format(message, args));
    }

    public static void suffix_e(String suffix, String message, Object... args) {
        Log.e(suffixTag(suffix), format(message, args));
    }

    private static String suffixTag(String suffix) {
        return TextUtils.isEmpty(suffix) ? TAG : TAG + suffix;
    }

    private static String format(String message, Object... args) {
        return String.format(message, args);
    }
}
