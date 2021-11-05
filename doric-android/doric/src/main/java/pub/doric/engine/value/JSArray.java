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

public class JSArray extends JSValue {
    private final JSValue[] mVal;

    public JSArray(int size) {
        mVal = new JSValue[size];
    }

    public void put(int index, JSValue val) {
        mVal[index] = val;
    }

    public JSValue get(int index) {
        return mVal[index];
    }

    public int size() {
        return mVal.length;
    }

    @Override
    public JSType getJSType() {
        return JSType.Array;
    }

    @Override
    public JSType value() {
        return JSType.Array;
    }

    public JSValue[] toArray() {
        return mVal;
    }

    public String[] toStringArray() {
        String[] ret = new String[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asString().value();
        }
        return ret;
    }

    public boolean[] toBooleanArray() {
        boolean[] ret = new boolean[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asBoolean().value();
        }
        return ret;
    }

    public int[] toIntArray() {
        int[] ret = new int[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asNumber().toInt();
        }
        return ret;
    }

    public float[] toFloatArray() {
        float[] ret = new float[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asNumber().toFloat();
        }
        return ret;
    }

    public double[] toDoubleArray() {
        double[] ret = new double[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asNumber().toDouble();
        }
        return ret;
    }

    public long[] toLongArray() {
        long[] ret = new long[mVal.length];
        for (int i = 0; i < ret.length; i++) {
            ret[i] = mVal[i].asNumber().toLong();
        }
        return ret;
    }
}
