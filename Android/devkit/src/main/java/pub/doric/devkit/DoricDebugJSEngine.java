package pub.doric.devkit;

import pub.doric.devkit.remote.DoricRemoteJSExecutor;
import pub.doric.engine.DoricJSEngine;
import pub.doric.engine.IStatusCallback;

public class DoricDebugJSEngine extends DoricJSEngine {

    private IStatusCallback statusCallback;

    public DoricDebugJSEngine(IStatusCallback statusCallback) {
        super();
        this.statusCallback = statusCallback;
    }

    @Override
    protected void initJSEngine() {
        mDoricJSE = new DoricRemoteJSExecutor(statusCallback);
    }
}
