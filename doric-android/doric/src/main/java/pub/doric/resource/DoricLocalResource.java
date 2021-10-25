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

import java.io.FileInputStream;
import java.io.IOException;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: This represents a local file
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricLocalResource extends DoricResource {

    public DoricLocalResource(DoricContext doricContext, String identifier) {
        super(doricContext, identifier);
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        AsyncResult<byte[]> result = new AsyncResult<>();
        FileInputStream fis = null;
        try {
             fis = new FileInputStream(identifier);
            byte[] data = new byte[fis.available()];
            fis.read(data);
            result.setResult(data);
        } catch (Exception e) {
            result.setError(e);
        }finally {
            if(fis!=null){
                try {
                    fis.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
        return result;
    }
}
