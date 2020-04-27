package pub.doric.plugin;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.widget.LinearLayout;

import androidx.appcompat.app.AppCompatActivity;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;
import com.qmuiteam.qmui.util.QMUIStatusBarHelper;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.navbar.BaseDoricNavBar;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;

@DoricPlugin(name = "statusbar")
public class StatusBarPlugin extends DoricJavaPlugin {

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
                    LinearLayout.LayoutParams lp = (LinearLayout.LayoutParams) ((BaseDoricNavBar) getDoricContext().getDoricNavBar()).getLayoutParams();
                    if (hidden) {
                        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_FULLSCREEN);
                        lp.topMargin = DoricUtils.getStatusBarHeight();
                    } else {
                        decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
                        lp.topMargin = 0;
                    }
                    ((BaseDoricNavBar) getDoricContext().getDoricNavBar()).setLayoutParams(lp);

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
                    if (mode == 0) {
                        QMUIStatusBarHelper.setStatusBarDarkMode((Activity) getDoricContext().getContext());
                    } else {
                        QMUIStatusBarHelper.setStatusBarLightMode((Activity) getDoricContext().getContext());
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
