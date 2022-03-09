package com.github.pengfeizhou.jscore;

public class JSArrayBuffer extends JSValue {
    private final byte[] mVal;

    public JSArrayBuffer(long ptr, int length) {
        this.mVal = new byte[0];
    }

    public JSArrayBuffer(byte[] val) {
        this.mVal = val;
    }

    public int getByteLength() {
        return mVal.length;
    }

    @Override
    public JSType getJSType() {
        return JSType.ArrayBuffer;
    }

    @Override
    public byte[] value() {
        return mVal;
    }
}
