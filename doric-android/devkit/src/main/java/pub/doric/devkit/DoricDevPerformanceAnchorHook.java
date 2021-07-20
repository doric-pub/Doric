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
package pub.doric.devkit;

import android.util.Log;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import pub.doric.performance.DoricPerformanceProfile;

/**
 * @Description: pub.doric.devkit
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/20
 */
public class DoricDevPerformanceAnchorHook implements DoricPerformanceProfile.GlobalAnchorHook {

    public static class AnchorNode {
        public String name;
        public long prepare;
        public long start;
        public long end;

        AnchorNode(String name, long prepare, long start, long end) {
            this.name = name;
            this.prepare = prepare;
            this.start = start;
            this.end = end;
        }
    }

    private static final String TAG = "DoricPerformance";

    private final Map<String, List<AnchorNode>> nodeMap = new HashMap<>();
    private final Comparator<AnchorNode> comparator = new Comparator<AnchorNode>() {
        @Override
        public int compare(AnchorNode o1, AnchorNode o2) {
            return (int) (o1.prepare - o2.prepare);
        }
    };

    @Override
    public void onAnchor(DoricPerformanceProfile profile, String name, long prepare, long start, long end) {
        Log.d(TAG, String.format("%s: %s prepared %dms, cost %dms.",
                profile.getName(), name, start - prepare, end - start));
        List<AnchorNode> list = nodeMap.get(profile.getName());
        if (list == null) {
            list = new ArrayList<>();
            nodeMap.put(profile.getName(), list);
        }
        list.add(new AnchorNode(name, prepare, start, end));
        Collections.sort(list, comparator);
        if (name.equals(DoricPerformanceProfile.STEP_DESTROY)) {
            nodeMap.remove(profile.getName());
        }
    }

    @Override
    public void onAnchor(String name, long prepare, long start, long end) {
        //DO nothing
    }

    public List<AnchorNode> getAnchorNodeList(String name) {
        List<AnchorNode> ret = nodeMap.get(name);
        if (ret == null) {
            ret = new ArrayList<>();
        }
        return ret;
    }
}
