package pub.doric.devkit.event;

public class ReloadEvent {
    public String source;
    public String script;

    public ReloadEvent(String source, String script) {
        this.source = source;
        this.script = script;
    }
}
