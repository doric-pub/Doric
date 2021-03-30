package pub.doric.plugin;

import android.app.Activity;
import android.os.Build;
import android.util.DisplayMetrics;

import androidx.annotation.RequiresApi;

import com.github.pengfeizhou.jscore.JSString;
import com.github.pengfeizhou.jscore.JavaValue;
import com.qmuiteam.qmui.util.QMUIKeyboardHelper;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.plugin
 * @Author: jingpeng.wang
 * @CreateDate: 2021-03-18
 */

@DoricPlugin(name = "keyboard")
public class KeyboardPlugin extends DoricJavaPlugin {

    private final Set<String> callbackIds = new HashSet<>();

    private float keyboardHeight = 0;

    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN_MR1)
    public KeyboardPlugin(DoricContext doricContext) {
        super(doricContext);

        if (getDoricContext().getContext() instanceof Activity) {
            Activity activity = (Activity) getDoricContext().getContext();

            DisplayMetrics metrics = new DisplayMetrics();
            activity.getWindowManager().getDefaultDisplay().getRealMetrics(metrics);
            int realHeight = metrics.heightPixels;

            activity.getWindowManager().getDefaultDisplay().getMetrics(metrics);
            int usableHeight = metrics.heightPixels;

            final int virtualNavigationHeight = realHeight - usableHeight;

            QMUIKeyboardHelper.setVisibilityEventListener(activity, new QMUIKeyboardHelper.KeyboardVisibilityEventListener() {
                @Override
                public boolean onVisibilityChanged(boolean isOpen, int heightDiff) {
                    Iterator<String> it = callbackIds.iterator();
                    if (it.hasNext()) {
                        do {
                            String callbackId = it.next();
                            DoricPromise callback = new DoricPromise(getDoricContext(), callbackId);

                            JSONObject data = new JSONObject();
                            try {
                                data.put("oldBottomMargin", 0);
                                data.put("bottomMargin", 0);
                                data.put("oldHeight", keyboardHeight);
                                data.put("height", DoricUtils.px2dp(heightDiff - virtualNavigationHeight));

                                keyboardHeight = DoricUtils.px2dp(heightDiff - virtualNavigationHeight);

                                callback.resolve(new JavaValue(data));
                            } catch (JSONException e) {
                                e.printStackTrace();
                                callback.reject();
                            }
                        } while (it.hasNext());
                    }
                    return false;
                }
            });
        }
    }

    @DoricMethod
    public void subscribe(JSString args, DoricPromise promise) {
        final String callbackId = args.asString().value();
        callbackIds.add(callbackId);
        promise.resolve(new JavaValue(callbackId));
    }

    @DoricMethod
    public void unsubscribe(String subscribeId, DoricPromise promise) {
        if (callbackIds.contains(subscribeId)) {
            callbackIds.remove(subscribeId);

            promise.resolve(new JavaValue(subscribeId));
        } else {
            promise.reject(new JavaValue("subscribeId does not exist"));
        }
    }
}
