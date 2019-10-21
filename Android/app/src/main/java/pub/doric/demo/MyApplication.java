package pub.doric.demo;

import android.app.Application;

import pub.doric.Doric;
import pub.doric.DoricRegistry;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class MyApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
        DoricRegistry.register(new DemoLibrary());
    }
}
