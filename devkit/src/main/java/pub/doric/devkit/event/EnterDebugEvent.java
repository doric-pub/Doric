package pub.doric.devkit.event;

public class EnterDebugEvent {

    private String contextId;

    public EnterDebugEvent(String contextId) {
        this.contextId = contextId;
    }

    public String getContextId() {
        return contextId;
    }
}
