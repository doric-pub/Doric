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

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import pub.doric.devkit.ui.DemoDebugActivity;
import pub.doric.refresh.DoricSwipeLayout;
import pub.doric.utils.DoricUtils;

public class MainActivity extends AppCompatActivity {

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
                if (str.endsWith("js")) {
                    ret.add(str);
                }
            }
            recyclerView.setAdapter(new MyAdapter(ret.toArray(new String[0])));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public class MyAdapter extends RecyclerView.Adapter<RecyclerView.ViewHolder> {

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
                @Override
                public String toString() {
                    return super.toString();
                }
            };
        }

        @Override
        public void onBindViewHolder(@NonNull RecyclerView.ViewHolder holder, final int position) {
            final TextView tv = (TextView) holder.itemView;
            tv.setText(data[position]);
            tv.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Intent intent = new Intent(tv.getContext(), DemoDebugActivity.class);
                    intent.putExtra("scheme", "assets://src/" + data[position]);
                    intent.putExtra("alias", data[position]);
                    tv.getContext().startActivity(intent);
                }
            });
        }

        @Override
        public int getItemCount() {
            return data.length;
        }
    }
}
