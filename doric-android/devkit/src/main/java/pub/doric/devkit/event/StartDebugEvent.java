package pub.doric.devkit.event;

public class StartDebugEvent {
    private String contextId;

    public StartDebugEvent(String contextId) {
        this.contextId = contextId;
    }

    public String getContextId() {
        return contextId;
    }
}
