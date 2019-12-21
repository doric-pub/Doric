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

import com.bumptech.glide.RequestBuilder;

import org.jetbrains.annotations.NotNull;

import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import pub.doric.async.AsyncResult;

/**
 * @Description: handle like "https://xxxx.js"
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-23
 */
public class DoricHttpJSLoader implements IDoricJSLoader {
    private OkHttpClient okHttpClient = new OkHttpClient();

    @Override
    public boolean filter(String scheme) {
        return scheme.startsWith("http");
    }

    @Override
    public AsyncResult<String> request(String scheme) {
        final AsyncResult<String> ret = new AsyncResult<>();
        okHttpClient.newCall(new Request.Builder().url(scheme).build()).enqueue(new Callback() {
            @Override
            public void onFailure(@NotNull Call call, @NotNull IOException e) {
                ret.setError(e);
            }

            @Override
            public void onResponse(@NotNull Call call, @NotNull Response response) {
                try {
                    ret.setResult(response.body().string());
                } catch (Exception e) {
                    ret.setError(e);
                }
            }
        });
        return ret;
    }
}
