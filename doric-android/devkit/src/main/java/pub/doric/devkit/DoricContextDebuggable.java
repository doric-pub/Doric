package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.IDoricDriver;

public class DoricContextDebuggable {
    private final DoricContext doricContext;
    private final IDoricDriver nativeDriver;
    private final WSClient wsClient;

    public DoricContextDebuggable(WSClient wsClient, DoricContext doricContext) {
        this.wsClient = wsClient;
        this.doricContext = doricContext;
        this.nativeDriver = this.doricContext.getDriver();
    }

    public void startDebug() {
        doricContext.setDriver(new DoricDebugDriver(this.wsClient));
        doricContext.reload(doricContext.getScript());
    }

    public void stopDebug(boolean resume) {
        IDoricDriver doricDriver = doricContext.getDriver();
        if (doricDriver instanceof DoricDebugDriver) {
            ((DoricDebugDriver) doricDriver).destroy();
        }
        if (resume) {
            doricContext.setDriver(nativeDriver);
            doricContext.reload(doricContext.getScript());
        }
    }
}
