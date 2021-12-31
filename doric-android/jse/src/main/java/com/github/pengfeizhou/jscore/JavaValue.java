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

import org.json.JSONArray;
import org.json.JSONObject;

public class JavaValue {
    protected static final int TYPE_NULL = 0;
    protected static final int TYPE_NUMBER = 1;
    protected static final int TYPE_BOOLEAN = 2;
    protected static final int TYPE_STRING = 3;
    protected static final int TYPE_OBJECT = 4;
    protected static final int TYPE_ARRAY = 5;
    protected static final int TYPE_ARRAYBUFFER = 6;

    protected JavaFunction[] functions = null;
    protected String[] functionNames = null;
    protected int type;
    protected String value = "";
    protected byte[] data = null;
    protected MemoryReleaser memoryReleaser = null;

    public JavaValue() {
        this.type = TYPE_NULL;
    }

    public JavaValue(double value) {
        this.value = String.valueOf(value);
        this.type = TYPE_NUMBER;
    }

    public JavaValue(String value) {
        this.value = String.valueOf(value);
        this.type = TYPE_STRING;
    }

    public JavaValue(boolean value) {
        this.value = String.valueOf(value);
        this.type = TYPE_BOOLEAN;
    }

    public JavaValue(Encoding object) {
        this.type = TYPE_OBJECT;
        this.value = object.encode().toString();
        this.functionNames = object.getFunctionNames();
        this.functions = object.getFunctions();
    }

    public JavaValue(JSONObject json) {
        this.type = TYPE_OBJECT;
        this.value = json.toString();
    }

    public JavaValue(JSONArray jsonArray) {
        this.type = TYPE_ARRAY;
        this.value = jsonArray.toString();
    }

    public JavaValue(Encoding[] objects) {
        this.type = TYPE_ARRAY;
        JSONArray jsonArray = new JSONArray();
        for (Encoding object : objects) {
            jsonArray.put(object.encode());
        }
        this.value = jsonArray.toString();
    }

    public JavaValue(byte[] data) {
        this.type = TYPE_ARRAYBUFFER;
        this.data = data;
    }

    public JavaValue(byte[] data, MemoryReleaser memoryReleaser) {
        this.type = TYPE_ARRAYBUFFER;
        this.data = data;
        this.memoryReleaser = memoryReleaser;
    }

    public int getType() {
        return type;
    }

    public String getValue() {
        return value;
    }

    public byte[] getByteData() {
        return data;
    }

    public interface MemoryReleaser {
        /**
         * Called when JS deallocated the arraybuffer
         */
        void deallocate(byte[] data);
    }

    /**
     * Called by JNI
     */
    private void onDeallocated() {
        if (this.memoryReleaser != null) {
            this.memoryReleaser.deallocate(this.data);
        }
    }
}