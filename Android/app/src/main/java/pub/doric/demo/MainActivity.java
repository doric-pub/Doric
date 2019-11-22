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
import android.os.Bundle;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import pub.doric.dev.DevPanel;
import pub.doric.utils.DoricUtils;

public class MainActivity extends AppCompatActivity {
    private DevPanel devPanel = new DevPanel();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);
        RecyclerView recyclerView = findViewById(R.id.root);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        try {
            String[] demos = getAssets().list("demo");
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
                    if (position == 0) {
                        devPanel.show(getSupportFragmentManager(), "DevPanel");
                        return;
                    }
                    Intent intent = new Intent(tv.getContext(), DemoActivity.class);
                    intent.putExtra("source", data[position]);
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
