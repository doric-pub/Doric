package pub.doric.demo;

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Bundle;
import android.view.ViewGroup;

import com.github.pengfeizhou.jscore.JSONBuilder;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;
import androidx.recyclerview.widget.StaggeredGridLayoutManager;
import pub.doric.DoricPanel;
import pub.doric.DoricSingleton;
import pub.doric.async.AsyncResult;
import pub.doric.utils.DoricLog;

public class DoricEmbeddedActivity extends AppCompatActivity {
    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_doric_panel_list);

        RecyclerView recyclerView = findViewById(R.id.doric_panel_rv);
        recyclerView.setBackgroundColor(Color.WHITE);
        recyclerView.setLayoutManager(new StaggeredGridLayoutManager(
                2,
                StaggeredGridLayoutManager.VERTICAL));
        recyclerView.setNestedScrollingEnabled(true);
        recyclerView.setAdapter(new MyAdapter());
    }

    private static class DoricHolder extends RecyclerView.ViewHolder {
        private final DoricPanel panel;

        public DoricHolder(@NonNull DoricPanel panel) {
            super(panel);
            this.panel = panel;
        }
    }

    private static class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {
        @NonNull
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            final DoricPanel doricPanel = new DoricPanel(parent.getContext());
            doricPanel.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT));
            doricPanel.setMinimumHeight(100);
            final String source;
            final String alias;
            if (viewType == 0) {
                source = "assets://src/CellModule1Demo.js";
                alias = "CellModule1Demo.js";
            } else {
                source = "assets://src/CellModule2Demo.js";
                alias = "CellModule2Demo.js";
            }

            DoricSingleton.getInstance().getJSLoaderManager().loadJSBundle(source).setCallback(new AsyncResult.Callback<String>() {
                @Override
                public void onResult(String result) {
                    doricPanel.config(result, alias, "{}");
                    doricPanel.getDoricContext().getRootNode().setReusable(true);
                }

                @Override
                public void onError(Throwable t) {
                    DoricLog.e("Doric load JS error:" + t.getLocalizedMessage());
                }

                @Override
                public void onFinish() {

                }
            });
            return new DoricHolder(doricPanel);
        }

        @Override
        public int getItemViewType(int position) {
            return position % 2 == 0 ? 0 : 1;
        }

        @SuppressLint("SetTextI18n")
        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
            if (holder instanceof DoricHolder) {
                ((DoricHolder) holder).panel.getDoricContext().callEntity("setData", new JSONBuilder()
                        .put("imageUrl", (holder.getItemViewType() == 0)
                                ? "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=8caf9c88dbeb00c6436f76e90c54eecc"
                                : "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202005%2F02%2F20200502185802_FuFU2.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=77131edf568efeda32c3a6513412f324")
                        .put("title", "" + (position + 1))
                        .put("content", "第" + (position + 1) + "\n" + "++++++++可填充内容++++++++" + ((holder.getItemViewType() == 0) ? "\n+++再加一行+++" : ""))
                        .toJSONObject());
            }
        }

        @Override
        public int getItemCount() {
            return 1000;
        }
    }
}
