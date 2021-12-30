package pub.doric;

import com.github.pengfeizhou.jscore.JavaValue;

import java.lang.ref.SoftReference;
import java.lang.ref.WeakReference;

public class RetainedJavaValue extends JavaValue {
    private final WeakReference<DoricContext> mDoricContext;

    public RetainedJavaValue(WeakReference<DoricContext> doricContext, byte[] data) {
        super(data);

        this.mDoricContext = doricContext;
        this.mDoricContext.get().retainJavaValue(new SoftReference<>(this));
        this.memoryReleaser = new MemoryReleaser() {
            @Override
            public void deallocate(byte[] data) {
                if (doricContext.get() != null) {
                    doricContext.get().releaseJavaValue(new SoftReference<>(RetainedJavaValue.this));
                }
            }
        };
    }
}
