package pub.doric.demo;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.util.Log;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.util.HashMap;
import java.util.Map;

import pub.doric.DoricContext;
import pub.doric.DoricPanel;
import pub.doric.DoricSingleton;
import pub.doric.async.AsyncResult;
import pub.doric.navigator.IDoricNavigator;
import pub.doric.performance.DoricPerformanceProfile;
import pub.doric.utils.DoricLog;
import pub.doric.utils.DoricUtils;

public class DoricPanelListActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_doric_panel_list);

        RecyclerView recyclerView = findViewById(R.id.doric_panel_rv);
        recyclerView.setBackgroundColor(Color.WHITE);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        recyclerView.setNestedScrollingEnabled(true);
        recyclerView.setAdapter(new MyAdapter(new String[]{
                "Counter.js",
                "EffectsDemo.js",
                "FlowLayoutDemo.js",
                "Gobang.js",
                "HelloDoric.js",
                "LayoutDemo.js",
                "TextAnimationDemo.js",
        }));
    }

    public static class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

        private final String[] data;
        private final Map<Integer, DoricPanel> panels = new HashMap<>();
        private static final int PANEL_HEIGHT = 300;
        final long pefStart = System.currentTimeMillis();

        public MyAdapter(String[] demos) {
            this.data = demos;
        }

        @NonNull
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            DoricPanel doricPanel = new DoricPanel(parent.getContext());
            doricPanel.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    DoricUtils.dp2px(PANEL_HEIGHT)));
            return new RecyclerView.ViewHolder(doricPanel) {
                @NonNull
                @Override
                public String toString() {
                    return super.toString();
                }
            };
        }

        @Override
        public int getItemViewType(int position) {
            return position;
        }

        @SuppressLint("SetTextI18n")
        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
            if (panels.containsKey(position)) {
                //TODO at here to handle on bind
            } else {
                panels.put(position, (DoricPanel) holder.itemView);
                String source = "assets://src/" + data[position];
                final String alias = "__dev__";
                final String extra = "{}";

                final DoricPanel doricPanel = (DoricPanel) holder.itemView;
                DoricSingleton.getInstance().getJSLoaderManager().loadJSBundle(source).setCallback(new AsyncResult.Callback<String>() {
                    @Override
                    public void onResult(String result) {
                        doricPanel.config(result, alias, extra);
                        DoricContext context = doricPanel.getDoricContext();
                        context.setDoricNavigator(new IDoricNavigator() {
                            @Override
                            public void push(String source, String alias, String extra) {

                            }

                            @Override
                            public void pop() {

                            }
                        });
                        doricPanel.getDoricContext().getPerformanceProfile().addAnchorHook(new DoricPerformanceProfile.AnchorHook() {
                            @Override
                            public void onAnchor(String name, long prepare, long start, long end) {
                                if (name.equals(DoricPerformanceProfile.STEP_RENDER)) {
                                    long cost = end - pefStart;
                                    Log.d("Timing", "Cost " + cost + "ms");
                                }
                            }
                        });
                    }

                    @Override
                    public void onError(Throwable t) {
                        DoricLog.e("Doric load JS error:" + t.getLocalizedMessage());
                    }

                    @Override
                    public void onFinish() {

                    }
                });
            }
        }

        @Override
        public int getItemCount() {
            return data.length;
        }
    }
}
