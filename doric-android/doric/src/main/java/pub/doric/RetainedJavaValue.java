package pub.doric;

import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;

public class RetainedJavaValue extends JavaValue {
    private final WeakReference<DoricContext> contextRef;

    public RetainedJavaValue(DoricContext doricContext, byte[] data) {
        super(data);
        contextRef = new WeakReference<>(doricContext);
        final SoftReference<RetainedJavaValue> softRef = new SoftReference<>(this);
        doricContext.retainJavaValue(softRef);
        this.memoryReleaser = new MemoryReleaser() {
            @Override
            public void deallocate(byte[] data) {
                if (contextRef.get() != null) {
                    contextRef.get().releaseJavaValue(softRef);
                }
            }
        };
    }
}
