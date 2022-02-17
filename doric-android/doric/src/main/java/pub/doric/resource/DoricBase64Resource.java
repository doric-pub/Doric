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

import android.text.TextUtils;
import android.util.Base64;
import android.util.Pair;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.utils.DoricUtils;

/**
 * @Description: This represents a base64 resource
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/22
 */
class DoricBase64Resource extends DoricResource {

    public DoricBase64Resource(DoricContext doricContext, String identifier) {
        super(doricContext, identifier);
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        AsyncResult<byte[]> ret = new AsyncResult<>();
        String[] split = identifier.split(",");
        if (split.length > 0) {
            try {
                byte[] data = Base64.decode(split[split.length - 1], Base64.DEFAULT);
                ret.setResult(data);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            ret.setError(new Error("Base64 format error"));
        }
        return ret;
    }
}
