package pub.doric.engine;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

public class DoricRemoteJSExecutor implements IDoricJSE {

    @Override
    public String loadJS(String script, String source) throws JSRuntimeException {
        return null;
    }

    @Override
    public JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException {
        return null;
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {

    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {

    }

    @Override
    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException {
        return null;
    }

    @Override
    public void teardown() {

    }
}
