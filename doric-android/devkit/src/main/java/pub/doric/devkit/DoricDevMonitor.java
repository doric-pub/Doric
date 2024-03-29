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

import com.github.pengfeizhou.jscore.JSONBuilder;

import java.io.PrintWriter;
import java.io.StringWriter;

import pub.doric.DoricContext;
import pub.doric.IDoricMonitor;

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
        StringWriter stringWriter = new StringWriter();
        e.printStackTrace(new PrintWriter(stringWriter));
        DoricDev.getInstance().sendDevCommand(
                "EXCEPTION",
                new JSONBuilder()
                        .put("source", "In source file: " + (context != null ? context.getSource() : "Unknown"))
                        .put("exception", stringWriter.toString())
                        .toJSONObject());
    }

    @Override
    public void onLog(int type, String message) {
        if (!DoricDev.getInstance().isInDevMode()) {
            return;
        }
        String typeString = "DEFAULT";
        switch (type) {
            case Log.ERROR:
                typeString = "ERROR";
                break;
            case Log.WARN:
                typeString = "WARN";
                break;
            default:
                break;
        }
        DoricDev.getInstance().sendDevCommand(
                "LOG",
                new JSONBuilder()
                        .put("type", typeString)
                        .put("message", message)
                        .toJSONObject());
    }
}
