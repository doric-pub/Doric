package pub.doric.devkit;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricNativeDriver;
import pub.doric.utils.DoricConstant;

public class DoricContextDebuggable {
    private DoricContext doricContext;
    private DoricDebugDriver doricDebugDriver;
    public boolean isDebugging = false;

    public DoricContextDebuggable(String contextId) {
        this.doricContext = DoricContextManager.getContext(contextId);
        isDebugging = true;
    }

    public void startDebug() {
        doricDebugDriver = new DoricDebugDriver(new IStatusCallback() {
            @Override
            public void start() {
                doricContext.setDriver(doricDebugDriver);

                doricContext.getRootNode().setId("");
                doricContext.callEntity(DoricConstant.DORIC_ENTITY_INIT, doricContext.getExtra());
                doricContext.callEntity(DoricConstant.DORIC_ENTITY_CREATE);
                doricContext.callEntity(DoricConstant.DORIC_ENTITY_BUILD, doricContext.getInitParams());
            }
        });
    }

    public void stopDebug() {
        isDebugging = false;
        doricDebugDriver.destroy();
        doricContext.setDriver(DoricNativeDriver.getInstance());

        doricContext.getRootNode().setId("");
        doricContext.callEntity(DoricConstant.DORIC_ENTITY_INIT, doricContext.getExtra());
        doricContext.callEntity(DoricConstant.DORIC_ENTITY_CREATE);
        doricContext.callEntity(DoricConstant.DORIC_ENTITY_BUILD, doricContext.getInitParams());
    }

    public DoricContext getContext() {
        return doricContext;
    }
}
