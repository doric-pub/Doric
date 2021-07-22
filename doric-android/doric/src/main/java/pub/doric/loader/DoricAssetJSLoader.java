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
package pub.doric.loader;

import android.content.res.AssetManager;

import java.io.IOException;
import java.io.InputStream;

import pub.doric.Doric;
import pub.doric.async.AsyncResult;

/**
 * @Description: handle "assets://asset-file-path"
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricAssetJSLoader implements IDoricJSLoader {
    @Override
    public boolean filter(String source) {
        return source.startsWith("assets");
    }

    @Override
    public AsyncResult<String> request(String source) {
        AsyncResult<String> result = new AsyncResult<>();
        String assetPath = source.substring("assets://".length());
        InputStream inputStream = null;
        try {
            AssetManager assetManager = Doric.application().getAssets();
            inputStream = assetManager.open(assetPath);
            int length = inputStream.available();
            byte[] buffer = new byte[length];
            inputStream.read(buffer);
            result.setResult(new String(buffer));
        } catch (Exception e) {
            e.printStackTrace();
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
        return result;
    }
}
