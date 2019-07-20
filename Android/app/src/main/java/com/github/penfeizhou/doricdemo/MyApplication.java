package com.github.penfeizhou.doricdemo;

import android.app.Application;

import com.github.penfeizhou.doric.Doric;
import com.github.penfeizhou.doric.DoricRegistry;

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
