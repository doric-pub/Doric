package pub.doric.devkit;

import android.app.Application;
import android.widget.Toast;

import com.lahm.library.EasyProtectorLib;
import com.lahm.library.EmulatorCheckCallback;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.EnterDebugEvent;
import pub.doric.devkit.event.OpenEvent;
import pub.doric.devkit.event.ReloadEvent;
import pub.doric.devkit.event.StartDebugEvent;
import pub.doric.devkit.event.StopDebugEvent;

public class DoricDev {
    private static class Inner {
        private static final DoricDev sInstance = new DoricDev();
    }

    private DoricDev() {
        EventBus.getDefault().register(this);
    }

    public static DoricDev getInstance() {
        return Inner.sInstance;
    }

    private Application application;
    public boolean devKitConnected = false;
    private DoricContextDebuggable doricContextDebuggable;

    public void init() {
        this.application = Doric.application();

        DevKit.isRunningInEmulator = EasyProtectorLib.checkIsRunningInEmulator(application, new EmulatorCheckCallback() {
            @Override
            public void findEmulator(String emulatorInfo) {
                System.out.println(emulatorInfo);
            }
        });
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onOpenEvent(OpenEvent openEvent) {
        devKitConnected = true;
        Toast.makeText(application, "dev kit connected", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEOFEvent(EOFExceptionEvent eofExceptionEvent) {
        devKitConnected = false;
        Toast.makeText(application, "dev kit eof exception", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onConnectExceptionEvent(ConnectExceptionEvent connectExceptionEvent) {
        devKitConnected = false;
        Toast.makeText(application, "dev kit connection exception", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onStartDebugEvent(StartDebugEvent startDebugEvent) {
        doricContextDebuggable = new DoricContextDebuggable(startDebugEvent.getContextId());
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEnterDebugEvent(EnterDebugEvent enterDebugEvent) {
        doricContextDebuggable.startDebug();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onQuitDebugEvent(StopDebugEvent quitDebugEvent) {
        doricContextDebuggable.stopDebug();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onReloadEvent(ReloadEvent reloadEvent) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (reloadEvent.source.contains(context.getSource())) {
                if (doricContextDebuggable != null &&
                        doricContextDebuggable.isDebugging &&
                        doricContextDebuggable.getContext().getContextId().equals(context.getContextId())) {
                    System.out.println("is debugging context id: " + context.getContextId());
                } else {
                    context.reload(reloadEvent.script);
                }
            }
        }
    }
}
