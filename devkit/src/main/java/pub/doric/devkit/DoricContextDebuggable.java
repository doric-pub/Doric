package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricNativeDriver;

public class DoricContextDebuggable {
    private DoricContext doricContext;
    private DoricDebugDriver doricDebugDriver;
    public boolean isDebugging = false;

    public DoricContextDebuggable(String contextId) {
        this.doricContext = DoricContextManager.getContext(contextId);
    }

    public void startDebug() {

        doricDebugDriver = new DoricDebugDriver(new IStatusCallback() {
            @Override
            public void start() {
                isDebugging = true;
                doricContext.setDriver(doricDebugDriver);
                doricContext.reInit();
            }
        });
    }

    public void stopDebug() {
        isDebugging = false;
        doricDebugDriver.destroy();
        doricContext.setDriver(DoricNativeDriver.getInstance());
        doricContext.reInit();
    }

    public DoricContext getContext() {
        return doricContext;
    }
}
