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

import android.app.Activity;
import android.content.Context;
import android.content.ContextWrapper;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.Point;
import android.graphics.Rect;
import android.os.Build;
import android.renderscript.Allocation;
import android.renderscript.Element;
import android.renderscript.RSRuntimeException;
import android.renderscript.RenderScript;
import android.renderscript.ScriptIntrinsicBlur;
import android.util.DisplayMetrics;
import android.util.Pair;
import android.view.Display;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

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
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

import pub.doric.Doric;

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
        } else if (arg instanceof JSONArray) {
            return new JavaValue((JSONArray) arg);
        } else if (arg instanceof String) {
            return new JavaValue((String) arg);
        } else if (arg instanceof Integer) {
            return new JavaValue((Integer) arg);
        } else if (arg instanceof Long) {
            return new JavaValue((Long) arg);
        } else if (arg instanceof Float) {
            return new JavaValue((Float) arg);
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

    public static Object toJavaObject(@NonNull Class<?> clz, JSDecoder decoder) throws Exception {
        if (clz == JSDecoder.class) {
            return decoder;
        } else {
            return toJavaObject(clz, decoder.decode());
        }
    }

    public static Object toJavaObject(@NonNull Class<?> clz, JSValue jsValue) {
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
            Class<?> elementClass = clz.getComponentType();
            Object ret;
            if (jsValue.isArray()) {
                JSArray jsArray = jsValue.asArray();
                ret = Array.newInstance(clz, jsArray.size());
                for (int i = 0; i < jsArray.size(); i++) {
                    assert elementClass != null;
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
            int orientation = context.getResources().getConfiguration().orientation;
            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
                sScreenWidthPixels = dm.widthPixels;
                sScreenHeightPixels = dm.heightPixels;
            } else if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
                sScreenWidthPixels = dm.heightPixels;
                sScreenHeightPixels = dm.widthPixels;
            }
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
            int orientation = context.getResources().getConfiguration().orientation;
            if (orientation == Configuration.ORIENTATION_PORTRAIT) {
                sScreenWidthPixels = dm.widthPixels;
                sScreenHeightPixels = dm.heightPixels;
            } else if (orientation == Configuration.ORIENTATION_LANDSCAPE) {
                sScreenWidthPixels = dm.heightPixels;
                sScreenHeightPixels = dm.widthPixels;
            }
        }
        return sScreenHeightPixels;
    }

    public static int getScreenHeight() {
        return getScreenHeight(null);
    }

    public static float px2dp(float pxValue) {
        return px2dp(null, pxValue);
    }

    public static float px2dp(Context context, float pxValue) {
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


    public static int getStatusBarHeight() {
        int resourceId = Resources.getSystem().getIdentifier("status_bar_height", "dimen", "android");
        if (resourceId > 0) {
            return Resources.getSystem().getDimensionPixelSize(resourceId);
        } else {
            return 0;
        }
    }

    public static float getScreenScale() {
        Resources resources = Resources.getSystem();
        if (resources.getDisplayMetrics() != null) {
            return resources.getDisplayMetrics().density;
        } else {
            return 1;
        }
    }

    private final static int NO_COLOR = 0x00000001;
    private final static int X_SIZE = 2;
    private final static int Y_SIZE = 2;
    private final static int COLOR_SIZE = 9;
    private final static int BUFFER_SIZE = X_SIZE * 4 + Y_SIZE * 4 + COLOR_SIZE * 4 + 32;

    public static byte[] getNinePatchChunk(Rect rect) {
        if (rect == null) {
            return null;
        }

        ByteBuffer byteBuffer = ByteBuffer.allocate(BUFFER_SIZE).order(ByteOrder.nativeOrder());
        // first byte，not equal to zero
        byteBuffer.put((byte) 1);

        //mDivX length
        byteBuffer.put((byte) 2);
        //mDivY length
        byteBuffer.put((byte) 2);
        //mColors length
        byteBuffer.put((byte) COLOR_SIZE);

        //skip
        byteBuffer.putInt(0);
        byteBuffer.putInt(0);

        //padding preset zero
        byteBuffer.putInt(0);
        byteBuffer.putInt(0);
        byteBuffer.putInt(0);
        byteBuffer.putInt(0);

        //skip
        byteBuffer.putInt(0);

        // mDivX
        byteBuffer.putInt(rect.left);
        byteBuffer.putInt(rect.right);

        // mDivY
        byteBuffer.putInt(rect.top);
        byteBuffer.putInt(rect.bottom);

        // mColors
        for (int i = 0; i < COLOR_SIZE; i++) {
            byteBuffer.putInt(NO_COLOR);
        }

        return byteBuffer.array();
    }

    public static Pair<String, String> translateBase64(String input) {
        String typePrefix = "data:image/";
        String dataPrefix = ";base64,";

        int typeIndex = input.indexOf(typePrefix);
        int dataIndex = input.indexOf(dataPrefix);

        if (typeIndex != -1 && dataIndex != -1) {
            String imageType = input.substring(typePrefix.length() + 1, dataIndex);
            String base64 = input.substring(dataIndex + dataPrefix.length());

            return new Pair<>(imageType, base64);
        }

        return null;
    }

    public static Context unwrap(Context context) {
        while (!(context instanceof Activity) && context instanceof ContextWrapper) {
            context = ((ContextWrapper) context).getBaseContext();
        }
        return context;
    }


    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public static boolean checkNavigationBarShow(@NonNull Context context, @NonNull Window window) {
        boolean show;
        Display display = window.getWindowManager().getDefaultDisplay();
        Point point = new Point();
        display.getRealSize(point);

        View decorView = window.getDecorView();
        Configuration conf = context.getResources().getConfiguration();
        if (Configuration.ORIENTATION_LANDSCAPE == conf.orientation) {
            View contentView = decorView.findViewById(android.R.id.content);
            show = (point.x != contentView.getWidth());
        } else {
            Rect rect = new Rect();
            decorView.getWindowVisibleDisplayFrame(rect);
            show = (rect.bottom != point.y);
        }
        return show;
    }


    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public static Bitmap rsBlur(Context context, Bitmap bitmap, int radius) throws RSRuntimeException {
        RenderScript rs = null;
        Allocation input = null;
        Allocation output = null;
        ScriptIntrinsicBlur blur = null;
        try {
            rs = RenderScript.create(context);
            rs.setMessageHandler(new RenderScript.RSMessageHandler());
            input = Allocation.createFromBitmap(rs, bitmap, Allocation.MipmapControl.MIPMAP_NONE,
                    Allocation.USAGE_SCRIPT);
            output = Allocation.createTyped(rs, input.getType());
            blur = ScriptIntrinsicBlur.create(rs, Element.U8_4(rs));

            blur.setInput(input);
            blur.setRadius(radius);
            blur.forEach(output);
            output.copyTo(bitmap);
        } finally {
            if (rs != null) {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                    RenderScript.releaseAllContexts();
                } else {
                    rs.destroy();
                }
            }
            if (input != null) {
                input.destroy();
            }
            if (output != null) {
                output.destroy();
            }
            if (blur != null) {
                blur.destroy();
            }
        }

        return bitmap;
    }

    public static Bitmap fastBlur(Bitmap sentBitmap, int radius, boolean canReuseInBitmap) {

        // Stack Blur v1.0 from
        // http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html
        //
        // Java Author: Mario Klingemann <mario at quasimondo.com>
        // http://incubator.quasimondo.com
        // created Feburary 29, 2004
        // Android port : Yahel Bouaziz <yahel at kayenko.com>
        // http://www.kayenko.com
        // ported april 5th, 2012

        // This is a compromise between Gaussian Blur and Box blur
        // It creates much better looking blurs than Box Blur, but is
        // 7x faster than my Gaussian Blur implementation.
        //
        // I called it Stack Blur because this describes best how this
        // filter works internally: it creates a kind of moving stack
        // of colors whilst scanning through the image. Thereby it
        // just has to add one new block of color to the right side
        // of the stack and remove the leftmost color. The remaining
        // colors on the topmost layer of the stack are either added on
        // or reduced by one, depending on if they are on the right or
        // on the left side of the stack.
        //
        // If you are using this algorithm in your code please add
        // the following line:
        //
        // Stack Blur Algorithm by Mario Klingemann <mario@quasimondo.com>

        Bitmap bitmap;
        if (canReuseInBitmap) {
            bitmap = sentBitmap;
        } else {
            bitmap = sentBitmap.copy(sentBitmap.getConfig(), true);
        }

        if (radius < 1) {
            return (null);
        }

        int w = bitmap.getWidth();
        int h = bitmap.getHeight();

        int[] pix = new int[w * h];
        bitmap.getPixels(pix, 0, w, 0, 0, w, h);

        int wm = w - 1;
        int hm = h - 1;
        int wh = w * h;
        int div = radius + radius + 1;

        int[] r = new int[wh];
        int[] g = new int[wh];
        int[] b = new int[wh];
        int rsum, gsum, bsum, x, y, i, p, yp, yi, yw;
        int[] vmin = new int[Math.max(w, h)];

        int divsum = (div + 1) >> 1;
        divsum *= divsum;
        int[] dv = new int[256 * divsum];
        for (i = 0; i < 256 * divsum; i++) {
            dv[i] = (i / divsum);
        }

        yw = yi = 0;

        int[][] stack = new int[div][3];
        int stackpointer;
        int stackstart;
        int[] sir;
        int rbs;
        int r1 = radius + 1;
        int routsum, goutsum, boutsum;
        int rinsum, ginsum, binsum;

        for (y = 0; y < h; y++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            for (i = -radius; i <= radius; i++) {
                p = pix[yi + Math.min(wm, Math.max(i, 0))];
                sir = stack[i + radius];
                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);
                rbs = r1 - Math.abs(i);
                rsum += sir[0] * rbs;
                gsum += sir[1] * rbs;
                bsum += sir[2] * rbs;
                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }
            }
            stackpointer = radius;

            for (x = 0; x < w; x++) {

                r[yi] = dv[rsum];
                g[yi] = dv[gsum];
                b[yi] = dv[bsum];

                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;

                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];

                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];

                if (y == 0) {
                    vmin[x] = Math.min(x + radius + 1, wm);
                }
                p = pix[yw + vmin[x]];

                sir[0] = (p & 0xff0000) >> 16;
                sir[1] = (p & 0x00ff00) >> 8;
                sir[2] = (p & 0x0000ff);

                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];

                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;

                stackpointer = (stackpointer + 1) % div;
                sir = stack[(stackpointer) % div];

                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];

                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];

                yi++;
            }
            yw += w;
        }
        for (x = 0; x < w; x++) {
            rinsum = ginsum = binsum = routsum = goutsum = boutsum = rsum = gsum = bsum = 0;
            yp = -radius * w;
            for (i = -radius; i <= radius; i++) {
                yi = Math.max(0, yp) + x;

                sir = stack[i + radius];

                sir[0] = r[yi];
                sir[1] = g[yi];
                sir[2] = b[yi];

                rbs = r1 - Math.abs(i);

                rsum += r[yi] * rbs;
                gsum += g[yi] * rbs;
                bsum += b[yi] * rbs;

                if (i > 0) {
                    rinsum += sir[0];
                    ginsum += sir[1];
                    binsum += sir[2];
                } else {
                    routsum += sir[0];
                    goutsum += sir[1];
                    boutsum += sir[2];
                }

                if (i < hm) {
                    yp += w;
                }
            }
            yi = x;
            stackpointer = radius;
            for (y = 0; y < h; y++) {
                // Preserve alpha channel: ( 0xff000000 & pix[yi] )
                pix[yi] = (0xff000000 & pix[yi]) | (dv[rsum] << 16) | (dv[gsum] << 8) | dv[bsum];

                rsum -= routsum;
                gsum -= goutsum;
                bsum -= boutsum;

                stackstart = stackpointer - radius + div;
                sir = stack[stackstart % div];

                routsum -= sir[0];
                goutsum -= sir[1];
                boutsum -= sir[2];

                if (x == 0) {
                    vmin[y] = Math.min(y + r1, hm) * w;
                }
                p = x + vmin[y];

                sir[0] = r[p];
                sir[1] = g[p];
                sir[2] = b[p];

                rinsum += sir[0];
                ginsum += sir[1];
                binsum += sir[2];

                rsum += rinsum;
                gsum += ginsum;
                bsum += binsum;

                stackpointer = (stackpointer + 1) % div;
                sir = stack[stackpointer];

                routsum += sir[0];
                goutsum += sir[1];
                boutsum += sir[2];

                rinsum -= sir[0];
                ginsum -= sir[1];
                binsum -= sir[2];

                yi += w;
            }
        }
        bitmap.setPixels(pix, 0, w, 0, 0, w, h);
        return (bitmap);
    }

    public static Bitmap blur(Context context, Bitmap inBitmap, int radius) {
        Bitmap bitmap;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2
                && radius <= 25) {
            try {
                bitmap = rsBlur(context, inBitmap, radius);
            } catch (Exception e) {
                bitmap = fastBlur(inBitmap, radius, true);
            }
        } else {
            bitmap = fastBlur(inBitmap, radius, true);
        }
        return bitmap;
    }
}
