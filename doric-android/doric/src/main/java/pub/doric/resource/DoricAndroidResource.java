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

import java.io.IOException;
import java.io.InputStream;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: This represents an android resource like a drawable from R.drawable
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricAndroidResource extends DoricResource {
    private final String defType;

    public DoricAndroidResource(String defType, DoricContext doricContext, String identifier) {
        super(doricContext, identifier);
        this.defType = defType;
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        AsyncResult<byte[]> result = new AsyncResult<>();
        int resId = doricContext.getContext().getResources().getIdentifier(
                identifier,
                defType,
                doricContext.getContext().getPackageName());
        if (resId > 0) {
            InputStream inputStream = null;
            try {
                inputStream = doricContext.getContext().getResources().openRawResource(resId);
                byte[] data = new byte[inputStream.available()];
                inputStream.read(data);
                result.setResult(data);
            } catch (Exception e) {
                result.setError(e);
            } finally {
                if (inputStream != null) {
                    try {
                        inputStream.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
        } else {
            result.setError(new Throwable("Cannot find resource for :" + identifier + ",type = " + defType));
        }
        return result;
    }
}
