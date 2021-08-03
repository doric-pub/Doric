package pub.doric.android;

import android.app.Application;

import pub.doric.Doric;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Doric.init(this);
    }
}
