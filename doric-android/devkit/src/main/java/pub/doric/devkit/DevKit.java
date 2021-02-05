package pub.doric.devkit;

import android.widget.Toast;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;


import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricLibrary;
import pub.doric.DoricRegistry;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.EnterDebugEvent;
import pub.doric.devkit.event.OpenEvent;
import pub.doric.devkit.event.ReloadEvent;
import pub.doric.devkit.event.StartDebugEvent;
import pub.doric.devkit.event.StopDebugEvent;

public class DevKit implements IDevKit {

    public static boolean isRunningInEmulator = false;
    public static String ip = "";
    private static Gson gson = new Gson();

    private static class Inner {
        private static final DevKit sInstance = new DevKit();
    }

    private DevKit() {
        Doric.registerLibrary(new DoricLibrary() {
            @Override
            public void load(DoricRegistry registry) {
                registry.registerMonitor(new DoricDevMonitor());
            }
        });
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            context.getDriver().getRegistry().registerMonitor(new DoricDevMonitor());
            break;
        }
        EventBus.getDefault().register(this);
    }

    public static DevKit getInstance() {
        return Inner.sInstance;
    }


    private WSClient wsClient;

    @Override
    public void connectDevKit(String url) {
        wsClient = new WSClient(url);
    }

    @Override
    public void sendDevCommand(IDevKit.Command command, JsonObject jsonObject) {
        JsonObject result = new JsonObject();
        result.addProperty("cmd", command.toString());
        result.add("data", jsonObject);
        wsClient.send(gson.toJson(result));
    }

    @Override
    public void disconnectDevKit() {
        wsClient.close();
        wsClient = null;
    }

    boolean devKitConnected = false;

    private DoricContextDebuggable doricContextDebuggable;

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onOpenEvent(OpenEvent openEvent) {
        devKitConnected = true;
        Toast.makeText(Doric.application(), "dev kit connected", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEOFEvent(EOFExceptionEvent eofExceptionEvent) {
        devKitConnected = false;
        Toast.makeText(Doric.application(), "dev kit eof exception", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onConnectExceptionEvent(ConnectExceptionEvent connectExceptionEvent) {
        devKitConnected = false;
        Toast.makeText(Doric.application(), "dev kit connection exception", Toast.LENGTH_LONG).show();
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
            if (doricContextDebuggable != null &&
                    doricContextDebuggable.isDebugging &&
                    doricContextDebuggable.getContext().getContextId().equals(context.getContextId())) {
                System.out.println("is debugging context id: " + context.getContextId());
            } else {
                if (reloadEvent.source.contains(context.getSource()) || context.getSource().equals("__dev__")) {
                    context.reload(reloadEvent.script);
                }
            }
        }
    }
}
