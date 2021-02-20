package pub.doric.devkit;

import android.widget.Toast;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;
import org.json.JSONObject;

import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricNativeDriver;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.OpenEvent;
import pub.doric.devkit.event.StopDebugEvent;

public class DevKit implements IDevKit {

    public static boolean isRunningInEmulator = false;
    public static String ip = "";


    private static class Inner {
        private static final DevKit sInstance = new DevKit();
    }

    private DevKit() {
        DoricNativeDriver.getInstance().getRegistry().registerMonitor(new DoricDevMonitor());
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
    public void sendDevCommand(IDevKit.Command command, JSONObject jsonObject) {
        wsClient.sendToServer(command.toString(), jsonObject);
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
    public void onQuitDebugEvent(StopDebugEvent quitDebugEvent) {
        doricContextDebuggable.stopDebug();
    }

    public DoricContext requestDebugContext(String source) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (source.contains(context.getSource()) || context.getSource().equals("__dev__")) {
                return context;
            }
        }
        return null;
    }

    public void reload(String source, String script) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (doricContextDebuggable != null &&
                    doricContextDebuggable.isDebugging &&
                    doricContextDebuggable.getContext().getContextId().equals(context.getContextId())) {
                System.out.println("is debugging context id: " + context.getContextId());
            } else {
                if (source.contains(context.getSource()) || context.getSource().equals("__dev__")) {
                    context.reload(script);
                }
            }
        }
    }
}
