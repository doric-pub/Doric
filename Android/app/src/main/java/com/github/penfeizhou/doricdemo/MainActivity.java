package com.github.penfeizhou.doricdemo;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSONBuilder;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        DoricContext doricContext = DoricContext.create(this, DoricUtils.readAssetFile("demo.js"), "demo");
        doricContext.callEntity("__init__", new JSONBuilder()
                .put("width", ViewGroup.LayoutParams.MATCH_PARENT)
                .put("height", ViewGroup.LayoutParams.MATCH_PARENT));
        doricContext.callEntity("log");
        doricContext.getRootNode().setRootView((FrameLayout) findViewById(R.id.root));
    }

}
