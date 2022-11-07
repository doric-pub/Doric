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
package pub.doric.demo;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import pub.doric.devkit.DoricDev;
import pub.doric.refresh.DoricSwipeLayout;
import pub.doric.utils.DoricUtils;

public class MainActivity extends AppCompatActivity {

    @SuppressLint("SetTextI18n")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        final DoricSwipeLayout swipeLayout = findViewById(R.id.swipe_layout);
        swipeLayout.setOnRefreshListener(new DoricSwipeLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                swipeLayout.setRefreshing(false);
            }
        });
        swipeLayout.setBackgroundColor(Color.YELLOW);
        swipeLayout.getRefreshView().setBackgroundColor(Color.RED);
        TextView textView = new TextView(this);
        textView.setText("This is header");
        swipeLayout.getRefreshView().setContent(textView);
        RecyclerView recyclerView = findViewById(R.id.root);
        recyclerView.setBackgroundColor(Color.WHITE);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        try {
            String[] demos = getAssets().list("src");
            List<String> ret = new ArrayList<>();
            for (String str : demos) {
                if (str.endsWith(".es5.js")) {
                    continue;
                }
                if (str.endsWith(".js")
                        || str.endsWith(".json")) {
                    ret.add(str);
                }
            }
            recyclerView.setAdapter(new MyAdapter(ret.toArray(new String[0])));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

        private final String[] data;

        public MyAdapter(String[] demos) {
            this.data = demos;
        }

        @NonNull
        @Override
        public RecyclerView.ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            TextView textView = new TextView(parent.getContext());
            textView.setGravity(Gravity.CENTER);
            textView.setLayoutParams(new ViewGroup.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    DoricUtils.dp2px(50)));
            textView.setTextSize(TypedValue.COMPLEX_UNIT_DIP, 20);
            return new RecyclerView.ViewHolder(textView) {
                @NonNull
                @Override
                public String toString() {
                    return super.toString();
                }
            };
        }

        @SuppressLint("SetTextI18n")
        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, @SuppressLint("RecyclerView") final int position) {
            final TextView tv = (TextView) holder.itemView;
            if (position == 0) {
                tv.setText("Dev Kit");
                tv.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        DoricDev.getInstance().openDevMode();
                    }
                });
            } else if (position == 1) {
                tv.setText("Doric Panel List");
                tv.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(tv.getContext(), DoricPanelListActivity.class);
                        tv.getContext().startActivity(intent);
                    }
                });
            } else if (position == 2) {
                tv.setText("Embedded Example");
                tv.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        Intent intent = new Intent(tv.getContext(), DoricEmbeddedActivity.class);
                        tv.getContext().startActivity(intent);
                    }
                });
            } else {
                tv.setText(data[position - 3]);
                tv.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        String filePath = data[position - 3];
                        if (filePath.endsWith(".json")) {
                            Intent intent = new Intent(tv.getContext(), DoricSSRActivity.class);
                            intent.putExtra("file", filePath);
                            tv.getContext().startActivity(intent);
                        } else {
                            Intent intent = new Intent(tv.getContext(), DoricDebugTimingActivity.class);
                            intent.putExtra("source", "assets://src/" + data[position - 3]);
                            //intent.putExtra("alias", data[position - 1].replace(".js", ""));
                            intent.putExtra("alias", "__dev__");
                            tv.getContext().startActivity(intent);
                        }
                    }
                });
            }
        }

        @Override
        public int getItemCount() {
            return data.length + 3;
        }
    }
}
