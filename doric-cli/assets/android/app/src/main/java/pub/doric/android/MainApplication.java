package pub.doric.android;

import android.app.Application;

import pub.doric.Doric;

/**
 * @Description: pub.doric.android
 * @Author: pengfei.zhou
 * @CreateDate: 2019-12-05
 */
public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
    }
}
