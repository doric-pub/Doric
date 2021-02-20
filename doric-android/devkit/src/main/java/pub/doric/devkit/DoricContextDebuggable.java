package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.IDoricDriver;

public class DoricContextDebuggable {
    private final DoricContext doricContext;
    private DoricDebugDriver debugDriver;
    private final IDoricDriver nativeDriver;
    public boolean isDebugging = false;

    public DoricContextDebuggable(DoricContext doricContext) {
        this.doricContext = doricContext;
        this.isDebugging = true;
        this.nativeDriver = this.doricContext.getDriver();
    }

    public void startDebug() {
        debugDriver = new DoricDebugDriver(new IStatusCallback() {
            @Override
            public void start() {
                doricContext.setDriver(debugDriver);
                doricContext.reload(doricContext.getScript());
            }
        });
    }

    public void stopDebug() {
        isDebugging = false;
        doricContext.setDriver(nativeDriver);
        debugDriver.destroy();
        doricContext.reload(doricContext.getScript());
    }

    public DoricContext getContext() {
        return doricContext;
    }
}
