package com.github.penfeizhou.doric.utils;

import android.content.res.AssetManager;
import android.support.annotation.NonNull;

import com.github.penfeizhou.doric.Doric;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;

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

    public static Object toJavaObject(@NonNull Class clz, JSDecoder decoder) throws Exception {
        if (clz == JSDecoder.class) {
            return decoder;
        } else {
            return toJavaObject(clz, decoder.decode());
        }
    }

    public static Object toJavaObject(@NonNull Class clz, JSValue jsValue) throws Exception {
        if (clz == JSValue.class || JSValue.class.isAssignableFrom(clz)) {
            return jsValue;
        } else if (clz == String.class) {
            return jsValue.asString().value();
        } else if (clz == boolean.class || clz == Boolean.class) {
            return jsValue.asBoolean().value();
        } else if (clz == int.class || clz == Integer.class) {
            return jsValue.asNumber().toInt();
        } else if (clz == long.class || clz == Long.class) {
            return jsValue.asNumber().toLong();
        } else if (clz == float.class || clz == Float.class) {
            return jsValue.asNumber().toFloat();
        } else if (clz == double.class || clz == Double.class) {
            return jsValue.asNumber().toDouble();
        } else if (clz.isArray()) {
            Class elementClass = clz.getComponentType();
            Object ret;
            if (jsValue.isArray()) {
                JSArray jsArray = jsValue.asArray();
                ret = Array.newInstance(clz, jsArray.size());
                for (int i = 0; i < jsArray.size(); i++) {
                    Array.set(ret, i, toJavaObject(elementClass, jsArray.get(i)));
                }
            } else if (jsValue.isNull()) {
                ret = Array.newInstance(clz, 0);
            } else {
                ret = null;
            }
            return ret;
        }
        return null;
    }
}
