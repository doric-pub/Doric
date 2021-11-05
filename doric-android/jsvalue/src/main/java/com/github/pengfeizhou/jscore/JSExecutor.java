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

public class JSExecutor {
    private JSExecutor() {
    }

    public static JSExecutor create() {
        throw new IllegalStateException("Empty implement");
    }

    public native void destroy();

    public native String loadJS(String script, String source) throws JSRuntimeException;

    public native JSDecoder evaluateJS(String script, String source, boolean hashKey) throws JSRuntimeException;

    public native void injectGlobalJSFunction(String name, JavaFunction javaFunction);

    public native void injectGlobalJSObject(String name, JavaValue javaValue);

    public native JSDecoder invokeMethod(String objectName, String functionName, JavaValue[] javaValues, boolean hashKey) throws JSRuntimeException;


    public native void injectNativeFunction(String funcName, long funcPtr);
}