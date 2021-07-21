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

import java.util.LinkedList;
import java.util.List;
import java.util.Locale;

import pub.doric.devkit.DoricDevPerformanceAnchorHook;
import pub.doric.devkit.R;
import pub.doric.performance.DoricPerformanceProfile;

/**
 * @Description: pub.doric.devkit.ui
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/19
 */
public class DoricDevPerfActivity extends DoricDevBaseActivity {
    private MyAdapter myAdapter;
    private TextView tvBtn;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_doricdev_perf);
        TextView textView = findViewById(R.id.tv_title);
        textView.setText(String.format("%s <%s>", doricContext.getSource(), doricContext.getContextId()));
        RecyclerView recyclerView = findViewById(R.id.list);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        myAdapter = new MyAdapter();
        recyclerView.setAdapter(myAdapter);
        tvBtn = findViewById(R.id.tv_button);
        tvBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (myAdapter.isAllExpanded()) {
                    for (AnchorItem anchorItem : myAdapter.anchorNodes) {
                        anchorItem.expanded = false;
                    }
                } else {
                    for (AnchorItem anchorItem : myAdapter.anchorNodes) {
                        anchorItem.expanded = true;
                    }
                }
                myAdapter.notifyDataSetChanged();
                updateButton();
            }
        });
    }

    private void updateButton() {
        if (myAdapter.isAllExpanded()) {
            tvBtn.setText("Collapse[-]");
        } else {
            tvBtn.setText("Expand[+]");
        }
    }

    private static class PerfCellHolder extends RecyclerView.ViewHolder {
        private TextView tvName;
        private LinearLayout layoutWaterfall;
        private View waterfallPrepared;
        private View waterfallWorked;
        private View waterfallPrefix;
        private View waterfallSuffix;
        private LinearLayout layoutExpand;
        private TextView tvFuncName;
        private TextView tvParameter;
        private TextView tvCost;

        private PerfCellHolder(@NonNull View itemView) {
            super(itemView);
        }
    }

    private static class AnchorItem {
        private String name;
        private long position;
        private long prepared;
        private long worked;
        private boolean expanded;
    }

    private class MyAdapter extends RecyclerView.Adapter<PerfCellHolder> {
        private final List<AnchorItem> anchorNodes = new LinkedList<>();
        private final long duration;

        private MyAdapter() {
            DoricPerformanceProfile.GlobalAnchorHook anchorHook
                    = doricContext.getDriver().getRegistry().getGlobalPerformanceAnchorHook();
            long position = 0;
            if (anchorHook instanceof DoricDevPerformanceAnchorHook) {
                DoricDevPerformanceAnchorHook.AnchorNode prevNode = null;
                for (DoricDevPerformanceAnchorHook.AnchorNode anchorNode :
                        ((DoricDevPerformanceAnchorHook) anchorHook)
                                .getAnchorNodeList(doricContext.getContextId())) {
                    AnchorItem anchorItem = new AnchorItem();
                    anchorItem.name = anchorNode.name;
                    long gap = 0;
                    if (prevNode != null) {
                        gap = Math.min(16, anchorNode.prepare - prevNode.end);
                    }
                    position += gap;
                    anchorItem.position = position;
                    anchorItem.prepared = anchorNode.start - anchorNode.prepare;
                    anchorItem.worked = anchorNode.end - anchorNode.start;
                    anchorNodes.add(anchorItem);
                    position += anchorItem.prepared + anchorItem.worked;
                    prevNode = anchorNode;
                }
                duration = position;
            } else {
                duration = 0;
            }
        }

        private boolean isAllExpanded() {
            boolean allExpanded = true;
            for (AnchorItem anchorItem : myAdapter.anchorNodes) {
                if (!anchorItem.expanded) {
                    allExpanded = false;
                    break;
                }
            }
            return allExpanded;
        }

        @Override
        public PerfCellHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View cell = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_doricdev_perf, parent, false);
            PerfCellHolder cellHolder = new PerfCellHolder(cell);
            cellHolder.tvName = cell.findViewById(R.id.tv_name);
            cellHolder.layoutWaterfall = cell.findViewById(R.id.layout_waterfall);
            cellHolder.waterfallPrepared = cell.findViewById(R.id.waterfall_prepared);
            cellHolder.waterfallWorked = cell.findViewById(R.id.waterfall_worked);
            cellHolder.waterfallPrefix = cell.findViewById(R.id.waterfall_prefix);
            cellHolder.waterfallSuffix = cell.findViewById(R.id.waterfall_suffix);
            cellHolder.layoutExpand = cell.findViewById(R.id.layout_expand);
            cellHolder.tvFuncName = cell.findViewById(R.id.tv_func_name);
            cellHolder.tvParameter = cell.findViewById(R.id.tv_parameter);
            cellHolder.tvCost = cell.findViewById(R.id.tv_cost);
            return cellHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull PerfCellHolder holder, int position) {
            holder.itemView.setBackgroundColor(position % 2 == 0 ? 0x2ff1c40f : 0x2f2ecc71);
            final AnchorItem anchorItem = anchorNodes.get(position);
            holder.layoutExpand.setVisibility(anchorItem.expanded ? View.VISIBLE : View.GONE);
            if (anchorItem.name.startsWith("Call")) {
                holder.tvName.setBackgroundColor(0xff3498db);
                holder.tvName.setText("Call");
                String extraInfo = anchorItem.name.substring("Call:".length());
                String[] info = extraInfo.split(",");
                if (info.length > 1) {
                    holder.tvFuncName.setVisibility(View.VISIBLE);
                    holder.tvFuncName.setText(info[0]);
                    holder.tvParameter.setVisibility(View.VISIBLE);
                    holder.tvParameter.setText(extraInfo.substring(extraInfo.indexOf(",") + 1));
                } else if (info.length > 0) {
                    holder.tvFuncName.setVisibility(View.VISIBLE);
                    holder.tvFuncName.setText(info[0]);
                    holder.tvParameter.setVisibility(View.GONE);
                } else {
                    holder.tvFuncName.setVisibility(View.GONE);
                    holder.tvParameter.setVisibility(View.GONE);
                }
            } else {
                if (anchorItem.name.equals("Render")) {
                    holder.tvName.setBackgroundColor(0xffe74c3c);
                } else {
                    holder.tvName.setBackgroundColor(0xff2ecc71);
                }
                holder.tvName.setText(anchorItem.name);
                holder.tvFuncName.setVisibility(View.GONE);
                holder.tvParameter.setVisibility(View.GONE);
            }
            ((LinearLayout.LayoutParams) (holder.waterfallPrefix.getLayoutParams())).weight
                    = anchorItem.position;
            ((LinearLayout.LayoutParams) (holder.waterfallPrepared.getLayoutParams())).weight
                    = anchorItem.prepared;
            ((LinearLayout.LayoutParams) (holder.waterfallWorked.getLayoutParams())).weight
                    = Math.max(anchorItem.worked, 1);
            ((LinearLayout.LayoutParams) (holder.waterfallSuffix.getLayoutParams())).weight
                    = duration - anchorItem.position - anchorItem.prepared - anchorItem.worked;
            holder.layoutWaterfall.requestLayout();
            holder.tvCost.setText(String.format(Locale.getDefault(),
                    "%d ms",
                    anchorItem.prepared + anchorItem.worked));
            holder.itemView.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    anchorItem.expanded = !anchorItem.expanded;
                    notifyDataSetChanged();
                    updateButton();
                }
            });
        }

        @Override
        public int getItemCount() {
            return anchorNodes.size();
        }
    }
}
