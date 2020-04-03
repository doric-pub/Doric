package pub.doric.devkit;

import android.content.Intent;

import pub.doric.Doric;
import pub.doric.devkit.ui.DoricDevActivity;
import pub.doric.devkit.util.SimulatorUtil;

public class DoricDev {
    private static class Inner {
        private static final DoricDev sInstance = new DoricDev();
    }

    private DoricDev() {
        DevKit.isRunningInEmulator = SimulatorUtil.isSimulator(Doric.application());
    }

    public static DoricDev getInstance() {
        return Inner.sInstance;
    }

    public void openDevMode() {
        Intent intent = new Intent(Doric.application(), DoricDevActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Doric.application().startActivity(intent);
    }

    public void closeDevMode() {
        DevKit.getInstance().disconnectDevKit();
    }

    public boolean isInDevMode() {
        return DevKit.getInstance().devKitConnected;
    }
}
