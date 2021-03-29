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

import android.util.Log;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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

    private static final boolean DEBUG = true;

    public DoricPerformanceProfile(String name) {
        this.name = name;
    }

    private final Map<String, Long> anchorMap = new ConcurrentHashMap<>();

    private void markAnchor(String eventName) {
        if (DEBUG) {
            anchorMap.put(eventName, System.currentTimeMillis());
        }
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
        if (DEBUG) {
            print(anchorName);
        }
    }

    private void print(String anchorName) {
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
        Log.d(TAG, String.format("%s: %s prepared %dms, cost %dms.",
                name, anchorName, start - prepare, end - start));
    }
}
