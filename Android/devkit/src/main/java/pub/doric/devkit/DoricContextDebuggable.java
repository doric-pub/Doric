package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.DoricNativeDriver;

public class DoricContextDebuggable {
    private DoricContext doricContext;
    private DoricDebugDriver doricDebugDriver;

    public DoricContextDebuggable(DoricContext doricContext) {
        this.doricContext = doricContext;
    }

    public void startDebug() {
        doricDebugDriver = new DoricDebugDriver(new IStatusCallback() {
            @Override
            public void start() {
                doricContext.setDriver(doricDebugDriver);
                doricContext.reInit();
            }
        });
    }

    public void stopDebug() {
        doricDebugDriver.destroy();
        doricContext.setDriver(DoricNativeDriver.getInstance());
        doricContext.reInit();
    }
}
