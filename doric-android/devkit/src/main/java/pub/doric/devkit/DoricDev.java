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

import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.widget.Toast;

import com.github.pengfeizhou.jscore.JSONBuilder;

import org.json.JSONObject;

import java.io.EOFException;
import java.net.ConnectException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.WeakHashMap;

import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricSingleton;
import pub.doric.devkit.ui.DoricDevActivity;
import pub.doric.devkit.util.SimulatorUtil;
import pub.doric.utils.DoricLog;

public class DoricDev {

    public interface StatusCallback {
        void onOpen(String url);

        void onClose(String url);

        void onFailure(Throwable throwable);

        void onReload(DoricContext context, String script);

        void onStartDebugging(DoricContext context);

        void onStopDebugging();
    }

    private final Set<StatusCallback> callbacks = new HashSet<>();
    private final WeakHashMap<String, DoricContext> reloadingContexts = new WeakHashMap<>();
    public final boolean isRunningInEmulator;
    private final Handler uiHandler = new Handler(Looper.getMainLooper());

    private static class Inner {
        private static final DoricDev sInstance = new DoricDev();
    }

    private DoricDev() {
        this.isRunningInEmulator = SimulatorUtil.isSimulator(Doric.application());
        DoricSingleton.getInstance().getNativeDriver().getRegistry().registerMonitor(new DoricDevMonitor());
        DoricSingleton.getInstance().getNativeDriver().getRegistry().setGlobalPerformanceAnchorHook(new DoricDevPerformanceAnchorHook());
        DoricSingleton.getInstance().getNativeDriver().getRegistry().registerNativePlugin(DoricDevkitPlugin.class);
        //Replace loader
        DoricSingleton.getInstance().getNativeDriver().getRegistry().getResourceManager().registerLoader(new DoricDevAssetsLoader());
    }

    public static DoricDev getInstance() {
        return Inner.sInstance;
    }

    public void openDevMode() {
        Intent intent = new Intent(Doric.application(), DoricDevActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        Doric.application().startActivity(intent);
    }

    public void closeDevMode() {
        stopDebugging(true);
        if (wsClient != null) {
            wsClient.close();
            wsClient = null;
        }
    }

    public boolean isInDevMode() {
        return devKitConnected;
    }


    private WSClient wsClient;

    private boolean devKitConnected = false;

    private DoricContextDebuggable debuggable;
    private String url;

    public void addStatusCallback(StatusCallback listener) {
        this.callbacks.add(listener);
    }

    public void removeStatusCallback(StatusCallback listener) {
        this.callbacks.remove(listener);
    }

    public void connectDevKit(String url) {
        if (wsClient != null) {
            wsClient.close();
        }
        devKitConnected = false;
        wsClient = new WSClient(url);
        this.url = url;
    }

    public String getIP() {
        if (url != null) {
            return url.replace("ws://", "").replace(":7777", "");
        } else {
            return "0.0.0.0";
        }

    }

    public void sendDevCommand(String command, JSONObject jsonObject) {
        wsClient.sendToServer(command, jsonObject);
    }

    public void startDebugging(String source) {
        if (debuggable != null) {
            debuggable.stopDebug(true);
        }
        List<DoricContext> contexts = matchAllContext(source);
        if (contexts.size() <= 0) {
            DoricLog.d("Cannot find  context source %s for debugging", source);
            wsClient.sendToDebugger("DEBUG_STOP", new JSONBuilder()
                    .put("msg", "Cannot find suitable alive context for debugging")
                    .toJSONObject());
        } else {
            final DoricContext context = contexts.get(contexts.size() - 1);
            wsClient.sendToDebugger(
                    "DEBUG_RES",
                    new JSONBuilder()
                            .put("contextId", context.getContextId())
                            .toJSONObject());
            uiHandler.post(new Runnable() {
                @Override
                public void run() {
                    debuggable = new DoricContextDebuggable(wsClient, context);
                    debuggable.startDebug();
                    for (StatusCallback callback : callbacks) {
                        callback.onStartDebugging(context);
                    }
                }
            });
        }
    }

    public void requestDebugging(DoricContext context) {
        wsClient.sendToServer("DEBUG", new JSONBuilder()
                .put("source", context.getSource())
                .put("script", context.getScript())
                .toJSONObject());
    }

    public void stopDebugging(final boolean resume) {
        wsClient.sendToDebugger("DEBUG_STOP", new JSONBuilder()
                .put("msg", "Stop debugging")
                .toJSONObject());
        if (debuggable != null) {
            uiHandler.post(new Runnable() {
                @Override
                public void run() {
                    debuggable.stopDebug(resume);
                    debuggable = null;
                    for (StatusCallback callback : callbacks) {
                        callback.onStopDebugging();
                    }
                }
            });
        }
    }


    public void onOpen() {
        devKitConnected = true;
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                Toast.makeText(Doric.application(), "dev kit connected", Toast.LENGTH_LONG).show();
                for (StatusCallback callback : callbacks) {
                    callback.onOpen(url);
                }
            }
        });
    }

    public void onClose() {
        devKitConnected = false;
        stopDebugging(true);
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                for (StatusCallback callback : callbacks) {
                    callback.onClose(url);
                }
            }
        });
    }

    public void onFailure(final Throwable t) {
        devKitConnected = false;
        stopDebugging(true);
        uiHandler.post(new Runnable() {
            @Override
            public void run() {
                if (t instanceof EOFException) {
                    Toast.makeText(Doric.application(), "Devkit lost connection", Toast.LENGTH_LONG).show();
                } else if (t instanceof ConnectException) {
                    Toast.makeText(Doric.application(), "Devkit connect to " + getIP() + " failed", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(Doric.application(), "Devkit connect fail:" + t.getLocalizedMessage(), Toast.LENGTH_LONG).show();
                }
                for (StatusCallback callback : callbacks) {
                    callback.onFailure(t);
                }
            }
        });
    }

    private List<DoricContext> matchAllContext(String source) {
        List<DoricContext> list = new ArrayList<>();
        source = source.replace(".js", "").replace(".ts", "");
        for (DoricContext context : DoricContextManager.aliveContexts()) {
            String doricSource = context.getSource();
            String[] split = doricSource.split(";");
            if (split.length > 1) {
                doricSource = split[0];
            }
            doricSource = doricSource.replace(".js", "").replace(".ts", "");
            if (source.equals(doricSource) || doricSource.equals("__dev__")) {
                list.add(context);
            }
        }
        return list;
    }

    public void reload(String source, final String script) {
        List<DoricContext> contexts = matchAllContext(source);
        if (contexts.size() <= 0) {
            DoricLog.d("Cannot find context source %s for reload", source);
        } else {
            for (final DoricContext context : contexts) {
                if (context.getDriver() instanceof DoricDebugDriver) {
                    DoricLog.d("Context source %s in debugging,skip reload", source);
                } else {
                    DoricLog.d("Context reload :id %s,source %s ", context.getContextId(), source);
                    uiHandler.post(new Runnable() {
                        @Override
                        public void run() {
                            context.reload(script);
                            if (reloadingContexts.get(context.getContextId()) == null) {
                                reloadingContexts.put(context.getContextId(), context);
                            }

                            for (StatusCallback callback : callbacks) {
                                callback.onReload(context, script);
                            }
                        }
                    });
                }
            }
        }

    }

    public boolean isReloadingContext(DoricContext context) {
        return reloadingContexts.get(context.getContextId()) != null;
    }
}
