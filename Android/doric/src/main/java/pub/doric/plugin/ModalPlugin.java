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

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.text.TextUtils;
import android.view.Gravity;
import android.widget.Toast;

import pub.doric.DoricContext;
import pub.doric.R;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPromise;
import pub.doric.utils.DoricUtils;
import pub.doric.utils.ThreadMode;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;
import com.github.pengfeizhou.jscore.JavaValue;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
@DoricPlugin(name = "modal")
public class ModalPlugin extends DoricJavaPlugin {

    public ModalPlugin(DoricContext doricContext) {
        super(doricContext);
    }

    @DoricMethod(name = "toast", thread = ThreadMode.UI)
    public void toast(JSDecoder decoder, DoricPromise promise) {
        try {
            JSObject jsObject = decoder.decode().asObject();
            String msg = jsObject.getProperty("msg").asString().value();
            JSValue gravityVal = jsObject.getProperty("gravity");
            int gravity = Gravity.BOTTOM;
            if (gravityVal.isNumber()) {
                gravity = gravityVal.asNumber().toInt();
            }
            Toast toast = Toast.makeText(getDoricContext().getContext(),
                    jsObject.getProperty("msg").asString().value(),
                    Toast.LENGTH_SHORT);
            if ((gravity & Gravity.TOP) == Gravity.TOP) {
                toast.setGravity(Gravity.TOP | Gravity.CENTER_HORIZONTAL, 0, DoricUtils.dp2px(50));
            } else if ((gravity & Gravity.BOTTOM) == Gravity.BOTTOM) {
                toast.setGravity(Gravity.BOTTOM | Gravity.CENTER_HORIZONTAL, 0, DoricUtils.dp2px(50));
            } else {
                toast.setGravity(Gravity.CENTER | Gravity.CENTER_HORIZONTAL, 0, 0);

            }
            toast.show();
        } catch (ArchiveException e) {
            e.printStackTrace();
        }
    }

    @DoricMethod(name = "alert", thread = ThreadMode.UI)
    public void alert(JSDecoder decoder, final DoricPromise promise) {
        try {
            JSObject jsObject = decoder.decode().asObject();
            JSValue titleVal = jsObject.getProperty("title");
            JSValue msgVal = jsObject.getProperty("msg");
            JSValue okBtn = jsObject.getProperty("okLabel");

            AlertDialog.Builder builder = new AlertDialog.Builder(getDoricContext().getContext(), R.style.Theme_Doric_Modal_Alert);
            if (titleVal.isString()) {
                builder.setTitle(titleVal.asString().value());
            }
            String btnTitle = getDoricContext().getContext().getString(android.R.string.ok);
            if (okBtn.isString()) {
                btnTitle = okBtn.asString().value();
            }
            builder.setMessage(msgVal.asString().value())
                    .setPositiveButton(btnTitle, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            promise.resolve();
                        }
                    });
            builder.setCancelable(false);
            try {
                builder.show();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (ArchiveException e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }


    @DoricMethod(name = "confirm", thread = ThreadMode.UI)
    public void confirm(JSDecoder decoder, final DoricPromise promise) {
        try {
            JSObject jsObject = decoder.decode().asObject();
            JSValue titleVal = jsObject.getProperty("title");
            JSValue msgVal = jsObject.getProperty("msg");
            JSValue okBtn = jsObject.getProperty("okLabel");
            JSValue cancelBtn = jsObject.getProperty("cancelLabel");

            AlertDialog.Builder builder = new AlertDialog.Builder(getDoricContext().getContext(), R.style.Theme_Doric_Modal_Alert);
            if (titleVal.isString()) {
                builder.setTitle(titleVal.asString().value());
            }
            String okLabel = getDoricContext().getContext().getString(android.R.string.ok);
            if (okBtn.isString()) {
                okLabel = okBtn.asString().value();
            }
            String cancelLabel = getDoricContext().getContext().getString(android.R.string.cancel);
            if (cancelBtn.isString()) {
                cancelLabel = cancelBtn.asString().value();
            }
            builder.setMessage(msgVal.asString().value())
                    .setPositiveButton(okLabel, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            promise.resolve();
                        }
                    })
                    .setNegativeButton(cancelLabel, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            promise.reject();
                        }
                    });
            builder.setCancelable(false);
            try {
                builder.show();
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (ArchiveException e) {
            e.printStackTrace();
            promise.reject(new JavaValue(e.getLocalizedMessage()));
        }
    }
}
