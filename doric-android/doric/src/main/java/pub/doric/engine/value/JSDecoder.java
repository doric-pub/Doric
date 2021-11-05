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
package pub.doric.engine.value;

import java.io.UnsupportedEncodingException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;

public class JSDecoder {
    private static final JSNull JS_NULL = new JSNull();
    private ByteBuffer byteBuffer;
    private byte[] __strBuf;

    public JSDecoder(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            bytes = new byte[1];
            bytes[0] = 'N';
        }
        this.byteBuffer = ByteBuffer.wrap(bytes);
        byteBuffer.order(ByteOrder.BIG_ENDIAN);
    }

    public boolean bool() throws ArchiveException {
        if (!isBool()) {
            throw new ArchiveException("unable to decode bool");
        }
        return readBool();
    }

    public boolean readBool() throws ArchiveException {
        return byteBuffer.get() == 1;
    }

    public String string() throws ArchiveException {
        if (!isString()) {
            throw new ArchiveException("unable to decode string");
        }
        return readString();
    }

    public String readString() throws ArchiveException {
        int len = byteBuffer.getInt();
        {
            // ceil to 4k
            int a = len / 0x1000;
            int l = (a + 1) * 0x1000;
            if (__strBuf == null || __strBuf.length < l) {
                __strBuf = new byte[l];
            }
        }
        byteBuffer.get(__strBuf, 0, len);
        try {
            return new String(__strBuf, 0, len, "utf-8");
        } catch (UnsupportedEncodingException e) {
            throw new ArchiveException("unable to decode string");
        }
    }

    public Double number() throws com.github.pengfeizhou.jscore.ArchiveException {
        if (!isNumber()) {
            throw new com.github.pengfeizhou.jscore.ArchiveException("unable to decode number");
        }
        return readNumber();
    }

    public Double readNumber() {
        return byteBuffer.getDouble();
    }

    public <T> T object(DecodingFactory<T> factory) throws ArchiveException {
        byteBuffer.rewind();
        return readObject(factory);
    }

    public <T> T readObject(DecodingFactory<T> factory) throws ArchiveException {
        byte b = byteBuffer.get();
        if (b == 'N') {
            return factory.createInstance();
        } else if (b == 'O') {
            T obj = factory.createInstance();
            if (obj == null) {
                throw new ArchiveException("unable to create instance");
            } else if (obj instanceof Decoding) {
                ((Decoding) obj).decode(this);
                return obj;
            } else {
                throw new ArchiveException("unable to decode class: "
                        + obj.getClass().getSimpleName());
            }
        } else {
            throw new ArchiveException("unable to read object: " + this);
        }
    }

    public <T> T[] array(DecodingFactory<T> factory) throws ArchiveException {
        byteBuffer.rewind();
        return readArray(factory);
    }

    public <T> T[] readArray(DecodingFactory<T> factory) throws ArchiveException {
        byte b = byteBuffer.get();
        if (b == 'N') {
            return factory.createArray(0);
        }
        if (b == 'A') {
            int len = byteBuffer.getInt();
            T[] array = factory.createArray(len);
            for (int i = 0; i < len; i++) {
                array[i] = readObject(factory);
            }
            return array;
        } else {
            throw new ArchiveException("unable to read array (object): " + this);
        }
    }

    public int readKeyHash() throws ArchiveException {
        String name = readString();
        return name.hashCode() & 0xffff;
    }

    public boolean isBool() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'B';
    }

    public boolean isNULL() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'N';
    }

    public boolean isString() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'S';
    }

    public boolean isNumber() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'D';
    }

    public boolean isArray() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'A';
    }

    public boolean isObject() {
        byteBuffer.rewind();
        return byteBuffer.get() == 'O';
    }


    public JSValue decode() throws ArchiveException {
        byte b = byteBuffer.get();
        switch (b) {
            case 'A': {
                int len = byteBuffer.getInt();
                JSArray ret = new JSArray(len);
                for (int i = 0; i < len; i++) {
                    ret.put(i, decode());
                }
                return ret;
            }
            case 'S': {
                return new JSString(readString());
            }
            case 'D': {
                return new JSNumber(readNumber());
            }
            case 'B': {
                return new JSBoolean(readBool());
            }
            case 'O': {
                JSObject jsObject = new JSObject();
                JSValue propertyName;
                while ((propertyName = decode()) instanceof JSString) {
                    jsObject.setProperty(((JSString) propertyName).value(), decode());
                }
                return jsObject;
            }
            case 'N':
            default:
                return JS_NULL;
        }
    }
}
