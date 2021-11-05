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


public abstract class JSValue {

    public enum JSType {
        Null,
        Number,
        Boolean,
        String,
        Object,
        Array,
    }

    public abstract JSType getJSType();

    public abstract Object value();

    public boolean isNull() {
        return getJSType() == JSType.Null;
    }

    public boolean isNumber() {
        return getJSType() == JSType.Number;
    }

    public boolean isBoolean() {
        return getJSType() == JSType.Boolean;
    }

    public boolean isString() {
        return getJSType() == JSType.String;
    }

    public boolean isObject() {
        return getJSType() == JSType.Object;
    }

    public boolean isArray() {
        return getJSType() == JSType.Array;
    }

    public JSNull asNull() {
        return (JSNull) this;
    }

    public JSNumber asNumber() {
        return (JSNumber) this;
    }

    public JSBoolean asBoolean() {
        return (JSBoolean) this;
    }

    public JSString asString() {
        return (JSString) this;
    }

    public JSObject asObject() {
        return (JSObject) this;
    }

    public JSArray asArray() {
        return (JSArray) this;
    }

    @Override
    public String toString() {
        return String.valueOf(value());
    }
}
