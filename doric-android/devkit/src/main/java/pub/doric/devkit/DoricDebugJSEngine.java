package pub.doric.devkit;

import android.util.Log;

import androidx.annotation.Nullable;

import com.google.gson.JsonObject;

import java.io.PrintWriter;
import java.io.StringWriter;

import pub.doric.DoricContext;
import pub.doric.devkit.remote.DoricRemoteJSExecutor;
import pub.doric.engine.DoricJSEngine;
import pub.doric.utils.DoricLog;

public class DoricDebugJSEngine extends DoricJSEngine {

    private IStatusCallback statusCallback;

    public DoricDebugJSEngine(IStatusCallback statusCallback) {
        super(false);
        this.statusCallback = statusCallback;
    }

    @Override
    protected void initJSEngine() {
        mDoricJSE = new DoricRemoteJSExecutor(statusCallback);
    }

    @Override
    public void onException(@Nullable DoricContext context, Exception e) {
        Log.e(DoricJSEngine.class.getSimpleName(), "In source file: " + (context != null ? context.getSource() : "Unknown"));
        e.printStackTrace();

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("source", "In source file: " + (context != null ? context.getSource() : "Unknown"));

        StringWriter stringWriter = new StringWriter();
        e.printStackTrace(new PrintWriter(stringWriter));
        jsonObject.addProperty("exception", stringWriter.toString());
        DevKit.getInstance().sendDevCommand(IDevKit.Command.EXCEPTION, jsonObject);
    }

    @Override
    public void onLog(int type, String message) {
        String typeString = "DEFAULT";
        switch (type) {
            case Log.ERROR:
                DoricLog.suffix_e("_js", message);
                typeString = "ERROR";
                break;
            case Log.WARN:
                DoricLog.suffix_w("_js", message);
                typeString = "WARN";
                break;
            default:
                DoricLog.suffix_d("_js", message);
                break;
        }

        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("type", typeString);
        jsonObject.addProperty("message", message);
        DevKit.getInstance().sendDevCommand(IDevKit.Command.LOG, jsonObject);
    }
}
