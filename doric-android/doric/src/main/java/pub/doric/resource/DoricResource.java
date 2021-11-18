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
 * @Description: This represents a resource entity
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public abstract class DoricResource {
    protected final DoricContext doricContext;
    protected final String identifier;

    public DoricResource(DoricContext doricContext, String identifier) {
        this.doricContext = doricContext;
        this.identifier = identifier;
    }

    public abstract AsyncResult<byte[]> fetchRaw();
}
