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
package pub.doric.devkit;

import pub.doric.devkit.remote.DoricRemoteJSExecutor;
import pub.doric.engine.DoricJSEngine;

public class DoricDebugJSEngine extends DoricJSEngine {
    private final WSClient wsClient;

    public DoricDebugJSEngine(WSClient wsClient) {
        super();
        this.wsClient = wsClient;
        this.getRegistry().registerMonitor(new DoricDevMonitor());
    }

    @Override
    protected void initJSEngine() {
        mDoricJSE = new DoricRemoteJSExecutor(this.wsClient);
    }

    public boolean isInvokingMethod() {
        if (mDoricJSE instanceof DoricRemoteJSExecutor) {
            return ((DoricRemoteJSExecutor) mDoricJSE).isInvokingMethod();
        }
        return false;
    }
}
