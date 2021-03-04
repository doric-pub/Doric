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
package pub.doric.devkit.remote;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSRuntimeException;
import com.github.pengfeizhou.jscore.JavaFunction;
import com.github.pengfeizhou.jscore.JavaValue;

import pub.doric.devkit.WSClient;
import pub.doric.engine.IDoricJSE;

public class DoricRemoteJSExecutor implements IDoricJSE {

    private final RemoteJSExecutor mRemoteJSExecutor;

    public DoricRemoteJSExecutor(WSClient wsClient) {
        this.mRemoteJSExecutor = new RemoteJSExecutor(wsClient);
    }

    @Override
    public String loadJS(String script, String source) throws JSRuntimeException {
        return mRemoteJSExecutor.loadJS(script, source);
    }

    @Override
    public JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException {
        return mRemoteJSExecutor.evaluateJS(script, source, hashKey);
    }

    @Override
    public void injectGlobalJSFunction(String name, JavaFunction javaFunction) {
        mRemoteJSExecutor.injectGlobalJSFunction(name, javaFunction);
    }

    @Override
    public void injectGlobalJSObject(String name, JavaValue javaValue) {
        mRemoteJSExecutor.injectGlobalJSObject(name, javaValue);
    }

    @Override
    public JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException {
        return mRemoteJSExecutor.invokeMethod(objectName, functionName, javaValues, hashKey);
    }

    @Override
    public void teardown() {
        mRemoteJSExecutor.destroy();
    }

    public boolean isInvokingMethod() {
        return mRemoteJSExecutor.invokingMethod;
    }
}
