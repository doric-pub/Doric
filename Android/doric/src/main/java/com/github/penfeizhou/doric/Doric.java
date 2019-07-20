package com.github.penfeizhou.doric;

import android.app.Application;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class Doric {
    private static Application sApplication;

    public static void init(Application application) {
        sApplication = application;
    }

    public static Application application() {
        return sApplication;
    }

}
