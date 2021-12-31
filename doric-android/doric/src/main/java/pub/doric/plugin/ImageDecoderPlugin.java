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
package pub.doric.plugin;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JavaValue;

import java.nio.ByteBuffer;

import pub.doric.DoricContext;
import pub.doric.engine.RetainedJavaValue;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.resource.DoricResource;
import pub.doric.utils.DoricLog;

/**
 * @Description: This is for loading resource into js as ArrayBuffer
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/18
 */
@DoricPlugin(name = "imageDecoder")
public class ImageDecoderPlugin extends DoricJavaPlugin {

    public ImageDecoderPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod
    public void getImageInfo(final JSObject resource, final DoricPromise promise) {
        DoricResource doricResource = getDoricContext().getDriver().getRegistry().getResourceManager().load(
                getDoricContext(),
                resource);
        if (doricResource != null) {
            doricResource.fetch().setCallback(new AsyncResult.Callback<byte[]>() {
                @Override
                public void onResult(byte[] rawData) {
                    BitmapFactory.Options options = new BitmapFactory.Options();
                    options.inJustDecodeBounds = true;
                    BitmapFactory.decodeByteArray(rawData, 0, rawData.length, options);
                    promise.resolve(new JavaValue(new JSONBuilder()
                            .put("width", options.outWidth)
                            .put("height", options.outHeight)
                            .put("mimeType", options.outMimeType)
                            .toJSONObject()));
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    DoricLog.e("Cannot load resource %s, %s", resource.toString(), t.getLocalizedMessage());
                    promise.reject(new JavaValue("Load error"));
                }

                @Override
                public void onFinish() {

                }
            });
        } else {
            DoricLog.e("Cannot find loader for resource %s", resource);
            promise.reject(new JavaValue("Load error"));
        }
    }

    @DoricMethod
    public void decodeToPixels(final JSObject resource, final DoricPromise promise) {
        DoricResource doricResource = getDoricContext().getDriver().getRegistry().getResourceManager().load(
                getDoricContext(),
                resource);
        if (doricResource != null) {
            doricResource.fetch().setCallback(new AsyncResult.Callback<byte[]>() {
                @Override
                public void onResult(byte[] rawData) {
                    BitmapFactory.Options options = new BitmapFactory.Options();
                    options.inPreferredConfig = Bitmap.Config.ARGB_8888;
                    Bitmap bitmap = BitmapFactory.decodeByteArray(rawData, 0, rawData.length);
                    ByteBuffer buffer = ByteBuffer.allocate(bitmap.getByteCount());
                    bitmap.copyPixelsToBuffer(buffer);
                    RetainedJavaValue retainedJavaValue = new RetainedJavaValue(getDoricContext(), buffer.array());
                    promise.resolve(retainedJavaValue);
                }

                @Override
                public void onError(Throwable t) {
                    t.printStackTrace();
                    DoricLog.e("Cannot load resource %s, %s", resource.toString(), t.getLocalizedMessage());
                    promise.reject(new JavaValue("Load error"));
                }

                @Override
                public void onFinish() {

                }
            });
        } else {
            DoricLog.e("Cannot find loader for resource %s", resource);
            promise.reject(new JavaValue("Load error"));
        }
    }
}
