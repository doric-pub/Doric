/*
 * Copyright [2022] [Doric.Pub]
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
package pub.doric.resource;

import com.github.pengfeizhou.jscore.JSArrayBuffer;


import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: Support ArrayBuffer
 * @Author: pengfei.zhou
 * @CreateDate: 2022/2/28
 */
class DoricArrayBufferResource extends DoricResource {
    private JSArrayBuffer value;

    public DoricArrayBufferResource(DoricContext doricContext, String identifier) {
        super(doricContext, identifier);
    }

    public void setValue(JSArrayBuffer value) {
        this.value = value;
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        final AsyncResult<byte[]> result = new AsyncResult<>();
        result.setResult(this.value.value());
        return result;
    }
}
