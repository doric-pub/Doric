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
package pub.doric.devkit.ui;


import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import pub.doric.devkit.R;

/**
 * @Description: pub.doric.devkit.ui
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/19
 */
public class DoricDevPerfActivity extends DoricDevBaseActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_doricdev_perf);
        TextView textView = findViewById(R.id.tv_title);
        textView.setText(String.format("Doric %s <%s>", doricContext.getSource(), doricContext.getContextId()));
        RecyclerView recyclerView = findViewById(R.id.list);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setAdapter(new MyAdapter());
    }

    private static class PerfCellHolder extends RecyclerView.ViewHolder {
        private TextView tvName;
        private LinearLayout layoutWaterfall;
        private View waterfallPrepared;
        private View waterfallWorked;
        private LinearLayout layoutExpand;
        private TextView tvFuncName;
        private TextView tvParameter;
        private TextView tvCost;

        public PerfCellHolder(@NonNull View itemView) {
            super(itemView);
        }
    }

    private static class AnchorNode {
        String name;
        long prepare;
    }

    private class MyAdapter extends RecyclerView.Adapter<PerfCellHolder> {
        private List<AnchorNode> anchorNodes = new ArrayList<>();

        private MyAdapter() {
//            Map<String, Long> anchorMap = doricContext.getPerformanceProfile().getAnchorMap();
//            for (String key : anchorMap.keySet()) {
//                if (key.endsWith("#prepare")) {
//                    Long prepare = anchorMap.get(key);
//                    if (prepare != null) {
//                        AnchorNode anchorNode = new AnchorNode();
//                        anchorNode.name = key.substring(0, key.lastIndexOf("#prepare"));
//                        anchorNode.prepare = prepare;
//                        anchorNodes.add(anchorNode);
//                    }
//                }
//            }
//            Collections.sort(anchorNodes, new Comparator<AnchorNode>() {
//                @Override
//                public int compare(AnchorNode o1, AnchorNode o2) {
//                    return (int) (o1.prepare - o2.prepare);
//                }
//            });
        }

        @Override
        public PerfCellHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View cell = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_doricdev_perf, parent, false);
            PerfCellHolder cellHolder = new PerfCellHolder(cell);
            cellHolder.tvName = cell.findViewById(R.id.tv_name);
            cellHolder.layoutWaterfall = cell.findViewById(R.id.layout_waterfall);
            cellHolder.waterfallPrepared = cell.findViewById(R.id.waterfall_prepared);
            cellHolder.waterfallWorked = cell.findViewById(R.id.waterfall_worked);
            cellHolder.layoutExpand = cell.findViewById(R.id.layout_expand);
            cellHolder.tvFuncName = cell.findViewById(R.id.tv_func_name);
            cellHolder.tvParameter = cell.findViewById(R.id.tv_parameter);
            cellHolder.tvCost = cell.findViewById(R.id.tv_cost);
            return cellHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull PerfCellHolder holder, int position) {
            holder.itemView.setBackgroundColor(position % 2 == 0 ? Color.parseColor("#ecf0f1") : Color.WHITE);
            holder.layoutExpand.setVisibility(View.GONE);
            AnchorNode anchorNode = anchorNodes.get(position);
            if (anchorNode.name.startsWith("Call")) {
                holder.tvName.setText("Call");
            } else {
                holder.tvName.setText(anchorNode.name);
            }
        }

        @Override
        public int getItemCount() {
            return anchorNodes.size();
        }
    }
}
