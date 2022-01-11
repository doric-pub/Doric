/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.engine;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSExecutor;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricNativeJSExecutor implements IDoricJSE {

    private final JSExecutor mJSExecutor;

    public DoricNativeJSExecutor() {
        this.mJSExecutor = JSExecutor.create();
    }

    @Override
    public String loadJS(String script, String source) throws JSRuntimeException {
        return mJSExecutor.loadJS(script, source);
    }

    @Override
    public JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException {
        return mJSExecutor.evaluateJS(script, source, hashKey);
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        mJSExecutor.injectGlobalJSFunction(name, javaFunction);
    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        mJSExecutor.injectGlobalJSObject(name, javaValue);
    }

    @Override
    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException {
        return mJSExecutor.invokeMethod(objectName, functionName, javaValues, hashKey);
    }

    @Override
    public void teardown() {
        mJSExecutor.destroy();
    }

    public JSExecutor getJSExecutor() {
        return mJSExecutor;
    }
}
