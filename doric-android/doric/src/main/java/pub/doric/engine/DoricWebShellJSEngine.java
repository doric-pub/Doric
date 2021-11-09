/*
 * Copyright [2021] [Doric.Pub]
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

import java.util.HashMap;
import java.util.Map;

import pub.doric.Doric;
import pub.doric.utils.DoricConstant;

/**
 * @Description: This uses DoricWebShellJSExecutor directly
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/9
 */
public class DoricWebShellJSEngine extends DoricJSEngine {
    private final Map<String, String> scriptIdMap = new HashMap<>();

    @Override
    protected void initJSEngine() {
        mDoricJSE = new DoricWebShellJSExecutor(Doric.application());
    }

    @Override
    public void prepareContext(String contextId, String script, String source) {
        String scriptId = mDoricJSE.loadJS(packageContextScript(contextId, script), "Context://" + source);
        scriptIdMap.put(contextId, scriptId);
    }

    @Override
    public void destroyContext(String contextId) {
        String scriptId = mDoricJSE.loadJS(String.format(DoricConstant.TEMPLATE_CONTEXT_DESTROY, contextId), "_Context://" + contextId);
        ((DoricWebShellJSExecutor) mDoricJSE).removeScript(scriptId);
        scriptId = scriptIdMap.get(contextId);
        ((DoricWebShellJSExecutor) mDoricJSE).removeScript(scriptId);
    }
}
