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
package pub.doric.performance;

import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import pub.doric.DoricRegistry;

/**
 * @Description: pub.doric.performance
 * @Author: pengfei.zhou
 * @CreateDate: 3/29/21
 */
public class DoricPerformanceProfile {
    private static final String TAG = DoricPerformanceProfile.class.getSimpleName();
    public static final String PART_INIT = "Init";
    public static final String STEP_CREATE = "Create";
    public static final String STEP_Call = "Call";
    public static final String STEP_DESTROY = "Destroy";
    public static final String STEP_RENDER = "Render";
    private static final String MARK_PREPARE = "prepare";
    private static final String MARK_START = "start";
    private static final String MARK_END = "end";
    private final String name;

    private boolean enable = DoricRegistry.isEnablePerformance();
    private static final Handler performanceHandler;
    private final Set<AnchorHook> hooks = new HashSet<>();

    static {
        HandlerThread performanceThread = new HandlerThread("DoricPerformance");
        performanceThread.start();
        performanceHandler = new Handler(performanceThread.getLooper());
    }

    public interface AnchorHook {
        void onAnchor(String name, long prepare, long start, long end);
    }

    public interface GlobalAnchorHook extends AnchorHook {
        void onAnchor(DoricPerformanceProfile profile, String name, long prepare, long start, long end);
    }

    public DoricPerformanceProfile(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }

    public void addAnchorHook(AnchorHook hook) {
        this.hooks.add(hook);
    }

    public void removeAnchorHook(AnchorHook hook) {
        this.hooks.remove(hook);
    }

    public void enable(boolean enable) {
        this.enable = enable;
    }

    private final Map<String, Long> anchorMap = new HashMap<>();

    private void markAnchor(final String eventName) {
        if (!enable) {
            return;
        }
        performanceHandler.post(new Runnable() {
            @Override
            public void run() {
                long time = System.currentTimeMillis();
                anchorMap.put(eventName, time);
            }
        });
    }

    private String getPrepareAnchor(String anchorName) {
        return anchorName + "#" + MARK_PREPARE;
    }

    private String getStartAnchor(String anchorName) {
        return anchorName + "#" + MARK_START;
    }

    private String getEndAnchor(String anchorName) {
        return anchorName + "#" + MARK_END;
    }

    public void prepare(String anchorName) {
        markAnchor(getPrepareAnchor(anchorName));
    }

    public void start(String anchorName) {
        markAnchor(getStartAnchor(anchorName));
    }

    public void end(String anchorName) {
        markAnchor(getEndAnchor(anchorName));
        print(anchorName);
    }

    private void print(final String anchorName) {
        if (!enable) {
            return;
        }
        performanceHandler.post(new Runnable() {
            @Override
            public void run() {
                Long prepare = anchorMap.get(getPrepareAnchor(anchorName));
                Long start = anchorMap.get(getStartAnchor(anchorName));
                Long end = anchorMap.get(getEndAnchor(anchorName));
                if (end == null) {
                    end = System.currentTimeMillis();
                }
                if (start == null) {
                    start = end;
                }
                if (prepare == null) {
                    prepare = start;
                }
                for (AnchorHook hook : hooks) {
                    if (hook instanceof GlobalAnchorHook) {
                        ((GlobalAnchorHook) hook).onAnchor(DoricPerformanceProfile.this, anchorName, prepare, start, end);
                    } else {
                        hook.onAnchor(anchorName, prepare, start, end);
                    }
                }
            }
        });
    }
}
