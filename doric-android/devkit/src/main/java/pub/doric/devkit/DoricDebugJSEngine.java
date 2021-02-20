package pub.doric.devkit;

import pub.doric.devkit.remote.DoricRemoteJSExecutor;
import pub.doric.engine.DoricJSEngine;

public class DoricDebugJSEngine extends DoricJSEngine {
    private final WSClient wsClient;

    public DoricDebugJSEngine(WSClient wsClient) {
        super();
        this.wsClient = wsClient;
    }

    @Override
    protected void initJSEngine() {
        mDoricJSE = new DoricRemoteJSExecutor(this.wsClient);
    }
}
