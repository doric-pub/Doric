package pub.doric.engine.remote;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.util.Iterator;

/**
 * Created by pengfei.zhou on 2018/4/17.
 */
public class ValueBuilder {
    private final Object val;

    private void writeBoolean(ByteArrayOutputStream output, boolean b) {
        output.write((byte) (b ? 1 : 0));
    }

    private void writeInt(ByteArrayOutputStream output, int i) {
        output.write((byte) (i >>> 24));
        output.write((byte) (i >>> 16));
        output.write((byte) (i >>> 8));
        output.write((byte) i);
    }

    private void writeDouble(ByteArrayOutputStream output, double d) {
        long l = Double.doubleToRawLongBits(d);
        output.write((byte) (l >>> 56));
        output.write((byte) (l >>> 48));
        output.write((byte) (l >>> 40));
        output.write((byte) (l >>> 32));
        output.write((byte) (l >>> 24));
        output.write((byte) (l >>> 16));
        output.write((byte) (l >>> 8));
        output.write((byte) l);
    }

    private void writeString(ByteArrayOutputStream output, String S) {
        byte[] buf;
        try {
            buf = S.getBytes("UTF-8");
        } catch (Exception e) {
            buf = new byte[0];
        }
        int i = buf.length;
        writeInt(output, i);
        output.write(buf, 0, i);
    }


    private void write(ByteArrayOutputStream output, Object O) {
        if (O instanceof Number) {
            output.write((byte) 'D');
            writeDouble(output, Double.valueOf(String.valueOf(O)));
        } else if (O instanceof String) {
            output.write((byte) 'S');
            writeString(output, (String) O);
        } else if (O instanceof Boolean) {
            output.write((byte) 'B');
            writeBoolean(output, (Boolean) O);
        } else if (O instanceof JSONObject) {
            output.write((byte) 'O');
            //writeBoolean(output, (Boolean) O);
            Iterator<String> iterator = ((JSONObject) O).keys();
            while (iterator.hasNext()) {
                String key = iterator.next();
                writeInt(output, key.hashCode());
                write(output, ((JSONObject) O).opt(key));
            }
            writeInt(output, 0);
        } else if (O instanceof JSONArray) {
            output.write((byte) 'A');
            writeInt(output, ((JSONArray) O).length());
            for (int i = 0; i < ((JSONArray) O).length(); i++) {
                write(output, ((JSONArray) O).opt(i));
            }
        } else {
            output.write((byte) 'N');
        }
    }

    public ValueBuilder(Object o) {
        this.val = o;
    }

    public byte[] build() {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        write(outputStream, val);
        return outputStream.toByteArray();
    }
}