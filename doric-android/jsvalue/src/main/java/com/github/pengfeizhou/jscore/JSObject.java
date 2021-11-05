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
package com.github.pengfeizhou.jscore;


import java.util.HashMap;
import java.util.Map;
import java.util.Set;

public class JSObject extends JSValue {
    private final Map<String, JSValue> mVal;

    public JSObject() {
        this.mVal = new HashMap<>();
    }

    public void setProperty(String name, JSValue val) {
        this.mVal.put(name, val);
    }

    public JSValue getProperty(String name) {
        JSValue jsValue = this.mVal.get(name);
        if (jsValue == null) {
            jsValue = new JSNull();
        }
        return jsValue;
    }

    @Override
    public JSType getJSType() {
        return JSType.Object;
    }

    @Override
    public Map<String, JSValue> value() {
        return mVal;
    }

    public Set<String> propertySet() {
        return mVal.keySet();
    }
}
