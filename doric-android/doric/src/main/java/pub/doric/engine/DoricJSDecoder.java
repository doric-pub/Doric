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
package pub.doric.engine;

import android.util.Base64;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSArrayBuffer;
import com.github.pengfeizhou.jscore.JSBoolean;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSNull;
import com.github.pengfeizhou.jscore.JSNumber;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSString;
import com.github.pengfeizhou.jscore.JSValue;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Iterator;

/**
 * @Description: This is for java runtime.
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/5
 */
public class DoricJSDecoder extends JSDecoder {
    private final Object value;
    private static final JSNull JS_NULL = new JSNull();

    public DoricJSDecoder(Object object) {
        super(null);
        this.value = object;
    }


    @Override
    public boolean readBool() throws ArchiveException {
        return (boolean) this.value;
    }


    @Override
    public String readString() throws ArchiveException {
        return (String) this.value;
    }

    @Override
    public Double readNumber() {
        return (Double) this.value;
    }

    @Override
    public boolean isBool() {
        return this.value instanceof Boolean;
    }

    @Override
    public boolean isNULL() {
        return this.value == JSONObject.NULL;
    }

    @Override
    public boolean isString() {
        return this.value instanceof String;
    }

    @Override
    public boolean isNumber() {
        return this.value instanceof Number;
    }

    @Override
    public boolean isArray() {
        return this.value instanceof JSONArray;
    }

    @Override
    public boolean isObject() {
        return this.value instanceof JSONObject;
    }

    @Override
    public JSValue decode() throws ArchiveException {
        if (isBool()) {
            return new JSBoolean((Boolean) this.value);
        }
        if (isString()) {
            if (((String) this.value).startsWith("__buffer_")) {
                String base64String = ((String) this.value).substring("__buffer_".length());
                byte[] data = Base64.decode(base64String, 0);
                return new DoricJSArrayBuffer(data);
            }
            return new JSString((String) this.value);
        }
        if (isNumber()) {
            return new JSNumber(((Number) this.value).doubleValue());
        }
        if (isObject()) {
            JSONObject jsonObject = (JSONObject) this.value;
            Iterator<String> it = jsonObject.keys();
            JSObject jsObject = new JSObject();
            while (it.hasNext()) {
                String key = it.next();
                Object o = jsonObject.opt(key);
                DoricJSDecoder jsDecoder = new DoricJSDecoder(o);
                JSValue jsValue = jsDecoder.decode();
                jsObject.setProperty(key, jsValue);
            }
            return jsObject;
        }
        if (isArray()) {
            JSONArray jsonArray = (JSONArray) this.value;
            int length = jsonArray.length();
            JSArray jsArray = new JSArray(length);
            for (int i = 0; i < length; i++) {
                Object o = jsonArray.opt(i);
                DoricJSDecoder jsDecoder = new DoricJSDecoder(o);
                JSValue jsValue = jsDecoder.decode();
                jsArray.put(i, jsValue);
            }
            return jsArray;
        }
        if (this.value instanceof byte[]) {
            return new DoricJSArrayBuffer((byte[]) this.value);
        }
        return JS_NULL;
    }

    private static class DoricJSArrayBuffer extends JSArrayBuffer {
        private final byte[] data;

        public DoricJSArrayBuffer(byte[] data) {
            super(0, data.length);
            this.data = data;
        }

        @Override
        public byte[] value() {
            return this.data;
        }
    }
}
