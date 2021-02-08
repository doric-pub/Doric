/*
 * Copyright [2019] [Doric.Pub]
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
package pub.doric.devkit;

import android.util.Log;

import com.google.gson.JsonObject;

import java.io.PrintWriter;
import java.io.StringWriter;

import pub.doric.DoricContext;
import pub.doric.IDoricMonitor;
import pub.doric.utils.DoricLog;

/**
 * @Description: pub.doric.devkit
 * @Author: pengfei.zhou
 * @CreateDate: 2/5/21
 */
public class DoricDevMonitor implements IDoricMonitor {
    @Override
    public void onException(DoricContext context, Exception e) {
        if (!DoricDev.getInstance().isInDevMode()) {
            return;
        }
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("source", "In source file: " + (context != null ? context.getSource() : "Unknown"));
        StringWriter stringWriter = new StringWriter();
        e.printStackTrace(new PrintWriter(stringWriter));
        jsonObject.addProperty("exception", stringWriter.toString());
        DevKit.getInstance().sendDevCommand(IDevKit.Command.EXCEPTION, jsonObject);
    }

    @Override
    public void onLog(int type, String message) {
        if (!DoricDev.getInstance().isInDevMode()) {
            return;
        }
        String typeString = "DEFAULT";
        switch (type) {
            case Log.ERROR:
                DoricLog.suffix_e("_js", message);
                typeString = "ERROR";
                break;
            case Log.WARN:
                DoricLog.suffix_w("_js", message);
                typeString = "WARN";
                break;
            default:
                DoricLog.suffix_d("_js", message);
                break;
        }
        JsonObject jsonObject = new JsonObject();
        jsonObject.addProperty("type", typeString);
        jsonObject.addProperty("message", message);
        DevKit.getInstance().sendDevCommand(IDevKit.Command.LOG, jsonObject);
    }
}
