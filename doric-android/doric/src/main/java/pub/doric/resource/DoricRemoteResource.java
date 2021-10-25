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
import com.bumptech.glide.load.DataSource;
import com.bumptech.glide.load.engine.GlideException;
import com.bumptech.glide.request.RequestListener;
import com.bumptech.glide.request.target.Target;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import androidx.annotation.Nullable;
import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;

/**
 * @Description: This represents a resource from network
 * @Author: pengfei.zhou
 * @CreateDate: 2021/10/20
 */
public class DoricRemoteResource extends DoricResource {

    public DoricRemoteResource(DoricContext doricContext, String identifier) {
        super(doricContext, identifier);
    }

    @Override
    public AsyncResult<InputStream> asInputStream() {
        final AsyncResult<InputStream> result = new AsyncResult<>();
        Glide.with(doricContext.getContext()).download(identifier)
                .listener(new RequestListener<File>() {
                    @Override
                    public boolean onLoadFailed(@Nullable GlideException e, Object model, Target<File> target, boolean isFirstResource) {
                        result.setError(e);
                        return false;
                    }

                    @Override
                    public boolean onResourceReady(File resource, Object model, Target<File> target, DataSource dataSource, boolean isFirstResource) {
                        try {
                            result.setResult(new FileInputStream(resource));
                        } catch (FileNotFoundException e) {
                            result.setError(e);
                        }
                        return false;
                    }
                })
                .submit();
        return result;
    }
}
