/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.utils;

import android.content.Context;
import android.content.res.AssetManager;

import androidx.annotation.NonNull;

import android.util.DisplayMetrics;
import android.view.Display;
import android.view.WindowManager;

import pub.doric.Doric;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Field;

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
        } else if (arg instanceof JSONBuilder) {
            return new JavaValue(((JSONBuilder) arg).toJSONObject());
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
        } else if (arg instanceof Object[]) {
            JSONArray jsonArray = new JSONArray();
            for (Object o : (Object[]) arg) {
                jsonArray.put(o);
            }
            return new JavaValue(jsonArray);
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

    private static int sScreenWidthPixels;
    private static int sScreenHeightPixels;

    public static int getScreenWidth(Context context) {
        if (context == null) {
            context = Doric.application();
        }
        if (sScreenWidthPixels > 0) {
            return sScreenWidthPixels;
        }
        DisplayMetrics dm = new DisplayMetrics();
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);

        Display display = manager.getDefaultDisplay();
        if (display != null) {
            display.getMetrics(dm);
            sScreenWidthPixels = dm.widthPixels;
            sScreenHeightPixels = dm.heightPixels;
        }
        return sScreenWidthPixels;
    }

    public static int getScreenWidth() {
        return getScreenWidth(null);
    }

    public static int getScreenHeight(Context context) {
        if (context == null) {
            context = Doric.application();
        }
        if (sScreenHeightPixels > 0) {
            return sScreenHeightPixels;
        }
        DisplayMetrics dm = new DisplayMetrics();
        WindowManager manager = (WindowManager) context.getSystemService(Context.WINDOW_SERVICE);

        Display display = manager.getDefaultDisplay();
        if (display != null) {
            display.getMetrics(dm);
            sScreenWidthPixels = dm.widthPixels;
            sScreenHeightPixels = dm.heightPixels;
        }
        return sScreenHeightPixels;
    }

    public static int getScreenHeight() {
        return getScreenHeight(null);
    }

    public static float px2dp(int pxValue) {
        return px2dp(null, pxValue);
    }

    public static float px2dp(Context context, int pxValue) {
        if (context == null) {
            context = Doric.application();
        }
        final float scale = context.getResources().getDisplayMetrics().density;
        return pxValue / scale;
    }

    public static int dp2px(float dpValue) {
        return dp2px(null, dpValue);
    }

    public static int dp2px(Context context, float dipValue) {
        if (context == null) {
            context = Doric.application();
        }
        final float scale = context.getResources().getDisplayMetrics().density;
        return (int) (dipValue * scale + (dipValue > 0 ? 0.5f : -0.5f));
    }


    public static int getStatusBarHeight(Context context) {
        Class<?> c = null;
        Object obj = null;
        Field field = null;
        int x = 0, sbar = 0;
        try {
            c = Class.forName("com.android.internal.R$dimen");
            obj = c.newInstance();
            field = c.getField("status_bar_height");
            x = Integer.parseInt(field.get(obj).toString());
            sbar = context.getResources().getDimensionPixelSize(x);
        } catch (Exception E) {
            E.printStackTrace();
        }
        return sbar;
    }

}
