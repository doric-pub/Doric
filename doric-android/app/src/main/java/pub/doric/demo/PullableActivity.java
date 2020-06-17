package pub.doric.demo;

import android.graphics.Color;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.widget.FrameLayout;

import pub.doric.refresh.DoricSwipeLayout;

public class PullableActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pullable);
        final DoricSwipeLayout swipeRefreshLayout = findViewById(R.id.swipe_layout);
        FrameLayout frameLayout = new FrameLayout(this);
        frameLayout.setBackgroundColor(Color.YELLOW);
        swipeRefreshLayout.addView(frameLayout);
        swipeRefreshLayout.setOnRefreshListener(new DoricSwipeLayout.OnRefreshListener() {
            @Override
            public void onRefresh() {
                swipeRefreshLayout.setRefreshing(false);
            }
        });
    }
}
