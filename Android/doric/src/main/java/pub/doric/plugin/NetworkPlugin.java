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
package pub.doric.plugin;

import android.text.TextUtils;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

import org.jetbrains.annotations.NotNull;
import org.json.JSONObject;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.internal.http.HttpMethod;
import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;

/**
 * @Description: pub.doric.plugin
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-21
 */
@DoricPlugin(name = "network")
public class NetworkPlugin extends DoricJavaPlugin {
    private OkHttpClient okHttpClient = new OkHttpClient();

    public NetworkPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(name = "request")
    public void request(JSDecoder decoder, final DoricPromise promise) {
        try {
            JSObject requestVal = decoder.decode().asObject();
            String url = requestVal.getProperty("url").asString().value();
            String method = requestVal.getProperty("method").asString().value();
            JSValue headerVal = requestVal.getProperty("headers");
            JSValue dataVal = requestVal.getProperty("data");
            JSValue timeoutVal = requestVal.getProperty("timeout");

            Headers.Builder headersBuilder = new Headers.Builder();
            if (headerVal.isObject()) {
                JSObject headerObject = headerVal.asObject();
                Set<String> headerKeys = headerObject.propertySet();
                for (String key : headerKeys) {
                    headersBuilder.add(key, headerObject.getProperty(key).asString().value());
                }
            }
            Headers headers = headersBuilder.build();
            String contentType = headers.get("Content-Type");
            MediaType mediaType = MediaType.parse(TextUtils.isEmpty(contentType) ? "application/json; charset=utf-8" : contentType);
            RequestBody requestBody = HttpMethod.permitsRequestBody(method) ? RequestBody.create(mediaType, dataVal.isString() ? dataVal.asString().value() : "") : null;
            Request.Builder requestBuilder = new Request.Builder();
            requestBuilder.url(url)
                    .headers(headers)
                    .method(method, requestBody);
            if (timeoutVal.isNumber() && okHttpClient.connectTimeoutMillis() != timeoutVal.asNumber().toLong()) {
                okHttpClient = okHttpClient.newBuilder().connectTimeout(timeoutVal.asNumber().toLong(), TimeUnit.MILLISECONDS).build();
            }
            okHttpClient.newCall(requestBuilder.build()).enqueue(new Callback() {
                @Override
                public void onFailure(@NotNull Call call, @NotNull IOException e) {
                    promise.reject(new JavaValue(e.getLocalizedMessage()));
                }

                @Override
                public void onResponse(@NotNull Call call, @NotNull Response response) throws IOException {
                    JSONBuilder header = new JSONBuilder();
                    for (String key : response.headers().names()) {
                        header.put(key, response.headers().get(key));
                    }
                    JSONObject jsonObject = new JSONBuilder()
                            .put("status", response.code())
                            .put("headers", header.toJSONObject())
                            .put("data", response.body() == null ? "" : response.body().string())
                            .toJSONObject();
                    promise.resolve(new JavaValue(jsonObject));
                }
            });

        } catch (Exception e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }

}
