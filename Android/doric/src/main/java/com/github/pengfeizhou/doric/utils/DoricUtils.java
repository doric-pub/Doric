package com.github.pengfeizhou.doric.utils;

import android.content.res.AssetManager;

import com.github.pengfeizhou.doric.Doric;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricUtils {
    public static String readAssetFile(String assetFile) {
        InputStream inputStream = null;
        try {
            AssetManager assetManager = Doric.application().getAssets();
            inputStream = assetManager.open(assetFile);
            int length = inputStream.available();
            byte[] buffer = new byte[length];
            inputStream.read(buffer);
            return new String(buffer);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return "";
    }

    public static JavaValue toJavaValue(Object arg) {
        if (arg == null) {
            return new JavaValue();
        } else if (arg instanceof JSONObject) {
            return new JavaValue((JSONObject) arg);
        } else if (arg instanceof String) {
            return new JavaValue((String) arg);
        } else if (arg instanceof Integer) {
            return new JavaValue((Integer) arg);
        } else if (arg instanceof Long) {
            return new JavaValue((Long) arg);
        } else if (arg instanceof Double) {
            return new JavaValue((Double) arg);
        } else if (arg instanceof Boolean) {
            return new JavaValue((Boolean) arg);
        } else if (arg instanceof JavaValue) {
            return (JavaValue) arg;
        } else {
            return new JavaValue(String.valueOf(arg));
        }
    }
}
