package pub.doric.devkit;

import android.content.Intent;
import android.widget.Toast;

import com.github.pengfeizhou.jscore.JSONBuilder;

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
import pub.doric.devkit.ui.DoricDevActivity;
import pub.doric.devkit.util.SimulatorUtil;
import pub.doric.utils.DoricLog;

public class DoricDev {
    public final boolean isRunningInEmulator;

    private static class Inner {
        private static final DoricDev sInstance = new DoricDev();
    }

    private DoricDev() {
        this.isRunningInEmulator = SimulatorUtil.isSimulator(Doric.application());
        DoricNativeDriver.getInstance().getRegistry().registerMonitor(new DoricDevMonitor());
        EventBus.getDefault().register(this);
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
        disconnectDevKit();
    }

    public boolean isInDevMode() {
        return devKitConnected;
    }


    private WSClient wsClient;

    private boolean devKitConnected = false;

    private DoricContextDebuggable debuggable;

    public void connectDevKit(String url) {
        wsClient = new WSClient(url);
    }

    public void sendDevCommand(String command, JSONObject jsonObject) {
        wsClient.sendToServer(command, jsonObject);
    }

    public void disconnectDevKit() {
        wsClient.close();
        wsClient = null;
    }

    public void startDebugging(String source) {
        if (debuggable != null) {
            debuggable.stopDebug(true);
        }
        DoricContext context = matchContext(source);
        if (context == null) {
            DoricLog.d("Cannot find  context source %s for debugging", source);
            wsClient.sendToDebugger("DEBUG_STOP", new JSONBuilder()
                    .put("msg", "Cannot find suitable alive context for debugging")
                    .toJSONObject());
        } else {
            wsClient.sendToDebugger(
                    "DEBUG_RES",
                    new JSONBuilder()
                            .put("contextId", context.getContextId())
                            .toJSONObject());
            debuggable = new DoricContextDebuggable(wsClient, context);
            debuggable.startDebug();
        }
    }

    public void stopDebugging(boolean resume) {
        wsClient.sendToDebugger("DEBUG_STOP", new JSONBuilder()
                .put("msg", "Stop debugging")
                .toJSONObject());
        if (debuggable != null) {
            debuggable.stopDebug(resume);
            debuggable = null;
        }
    }


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
        stopDebugging(true);
    }

    public DoricContext matchContext(String source) {
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            if (source.contains(context.getSource()) || context.getSource().equals("__dev__")) {
                return context;
            }
        }
        return null;
    }

    public void reload(String source, String script) {
        DoricContext context = matchContext(source);
        if (context == null) {
            DoricLog.d("Cannot find context source %s for reload", source);
        } else if (context.getDriver() instanceof DoricDebugDriver) {
            DoricLog.d("Context source %s in debugging,skip reload", source);
        } else {
            DoricLog.d("Context reload :id %s,source %s ", context.getContextId(), source);
            context.reload(script);
        }
    }
}
