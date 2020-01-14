package pub.doric.plugin;

import android.os.Build;
import android.view.View;

import androidx.appcompat.app.AppCompatActivity;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;

@DoricPlugin(name = "statusbar")
public class StatusBarPlugin extends DoricJavaPlugin {

    private int currentMode = 0;

    public StatusBarPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void setHidden(JSDecoder jsDecoder, final DoricPromise promise) {
        try {
            JSObject jsObject = jsDecoder.decode().asObject();
            final boolean hidden = jsObject.getProperty("hidden").asBoolean().value();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() {
                    AppCompatActivity activity = ((AppCompatActivity) getDoricContext().getContext());
                    View decorView = activity.getWindow().getDecorView();
                    if (hidden) {
                        decorView.setPadding(0, DoricUtils.getStatusBarHeight(activity), 0, 0);
                        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN);
                    } else {
                        decorView.setPadding(0, 0, 0, 0);
                        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
                    }
                    currentMode = 0;
                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void setMode(JSDecoder jsDecoder, final DoricPromise promise) {
        try {
            JSObject jsObject = jsDecoder.decode().asObject();
            final int mode = jsObject.getProperty("mode").asNumber().toInt();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        AppCompatActivity activity = ((AppCompatActivity) getDoricContext().getContext());
                        View decorView = activity.getWindow().getDecorView();

                        int flags = decorView.getSystemUiVisibility();
                        if (mode == currentMode) {
                            return null;
                        } else {
                            currentMode = mode;
                        }
                        flags ^= View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
                        decorView.setSystemUiVisibility(flags);
                    }

                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

    @DoricMethod
    public void setColor(JSDecoder jsDecoder, final DoricPromise promise) {
        try {
            JSObject jsObject = jsDecoder.decode().asObject();
            final int color = jsObject.getProperty("color").asNumber().toInt();
            getDoricContext().getDriver().asyncCall(new Callable<Object>() {
                @Override
                public Object call() {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                        AppCompatActivity activity = ((AppCompatActivity) getDoricContext().getContext());
                        activity.getWindow().setStatusBarColor(color);
                    }
                    return null;
                }
            }, ThreadMode.UI).setCallback(new AsyncResult.Callback<Object>() {
                @Override
                public void onResult(Object result) {
                    promise.resolve();
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    promise.reject(new JavaValue(t.getLocalizedMessage()));
                }

                @Override
                public void onFinish() {

                }
            });
        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }
}
