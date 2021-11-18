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
package pub.doric.resource;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: This represents an arrayBuffer resource
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/18
 */
public class DoricArrayBufferResource extends DoricResource {
    private final byte[] data;

    public DoricArrayBufferResource(DoricContext doricContext, byte[] data) {
        super(doricContext, "");
        this.data = data;
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        return new AsyncResult<>(data);
    }
}
