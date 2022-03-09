package pub.doric.engine;

import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;
import java.nio.ByteBuffer;

import pub.doric.DoricContext;

public class RetainedJavaValue extends JavaValue {
    private final WeakReference<DoricContext> contextRef;

    public RetainedJavaValue(DoricContext doricContext, ByteBuffer data) {
        super(data, null);
        contextRef = new WeakReference<>(doricContext);
        final SoftReference<RetainedJavaValue> softRef = new SoftReference<>(this);
        doricContext.retainJavaValue(softRef);
        this.memoryReleaser = new MemoryReleaser() {
            @Override
            public void deallocate(ByteBuffer data) {
                if (contextRef.get() != null) {
                    contextRef.get().releaseJavaValue(softRef);
                }
            }
        };
    }
}
