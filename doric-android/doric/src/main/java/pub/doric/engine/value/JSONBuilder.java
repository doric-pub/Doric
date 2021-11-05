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


import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class JSONBuilder {

    private final JSONObject jsonObject;

    public JSONBuilder() {
        this.jsonObject = new JSONObject();
    }

    public JSONBuilder(JSONObject jsonObject) {
        this.jsonObject = jsonObject;
    }

    public JSONBuilder put(String key, Object val) {
        try {
            if (val == null) {
                jsonObject.put(key, JSONObject.NULL);
            } else if (val instanceof Encoding) {
                jsonObject.put(key, ((Encoding) val).encode());
            } else if (val instanceof Encoding[]) {
                JSONArray jsonArray = new JSONArray();
                for (Encoding object : (Encoding[]) val) {
                    jsonArray.put(object.encode());
                }
                jsonObject.put(key, jsonArray);
            } else {
                jsonObject.put(key, val);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return this;
    }

    @Override
    public String toString() {
        return jsonObject.toString();
    }

    public JSONObject toJSONObject() {
        return jsonObject;
    }

    public JavaValue toValue() {
        return new JavaValue(jsonObject);
    }
}