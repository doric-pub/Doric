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

import com.bumptech.glide.Glide;
import com.bumptech.glide.RequestBuilder;
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.Key;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.load.model.GlideUrl;
import com.bumptech.glide.load.model.LazyHeaders;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.util.HashMap;
import java.util.Map;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: This represents a resource from network
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricRemoteResource extends DoricResource {
    private final boolean needCache;
    private final Map<String, String> headers = new HashMap<>();

    public DoricRemoteResource(DoricContext doricContext, String identifier, boolean needCache) {
        super(doricContext, identifier);
        this.needCache = needCache;
    }

    public DoricRemoteResource(DoricContext doricContext, String identifier) {
        this(doricContext, identifier, true);
    }

    public void setHeader(String k, String v) {
        this.headers.put(k, v);
    }

    @Override
    public AsyncResult<byte[]> fetchRaw() {
        final AsyncResult<byte[]> result = new AsyncResult<>();
        LazyHeaders.Builder builder = new LazyHeaders.Builder();
        for (Map.Entry<String, String> entry : headers.entrySet()) {
            builder.addHeader(entry.getKey(), entry.getValue());
        }
        RequestBuilder<File> requestBuilder = Glide.with(doricContext.getContext())
                .download(new GlideUrl(identifier, builder.build()));
        if (!this.needCache) {
            requestBuilder = requestBuilder.skipMemoryCache(true).signature(new Key() {
                @Override
                public void updateDiskCacheKey(@NonNull MessageDigest messageDigest) {
                    messageDigest.update(toString().getBytes(CHARSET));
                }
            });
        }
        requestBuilder
                .listener(new RequestListener<File>() {
                    @Override
                    public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<File> target, boolean isFirstResource) {
                        result.setError(e);
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(File resource, Object model, Target<File> target, DataSource dataSource, boolean isFirstResource) {
                        FileInputStream fis = null;
                        try {
                            fis = new FileInputStream(resource);
                            byte[] data = new byte[fis.available()];
                            fis.read(data);
                            result.setResult(data);
                        } catch (Exception e) {
                            result.setError(e);
                        } finally {
                            if (fis != null) {
                                try {
                                    fis.close();
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        }
                        if (!needCache) {
                            resource.delete();
                        }
                        return false;
                    }
                })
                .submit();
        return result;
    }
}
