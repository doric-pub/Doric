package pub.doric.devkit;

import android.content.Intent;

import com.lahm.library.EasyProtectorLib;
import com.lahm.library.EmulatorCheckCallback;

import org.greenrobot.eventbus.EventBus;

import pub.doric.Doric;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.ui.DoricDevActivity;

public class DoricDev {
    private static class Inner {
        private static final DoricDev sInstance = new DoricDev();
    }

    private DoricDev() {
        DevKit.isRunningInEmulator = EasyProtectorLib.checkIsRunningInEmulator(Doric.application(), new EmulatorCheckCallback() {
            @Override
            public void findEmulator(String emulatorInfo) {
                System.out.println(emulatorInfo);
            }
        });
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
