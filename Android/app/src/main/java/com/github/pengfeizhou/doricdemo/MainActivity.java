package com.github.pengfeizhou.doricdemo;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.github.pengfeizhou.doric.DoricContext;
import com.github.pengfeizhou.doric.utils.DoricUtils;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        DoricContext doricContext = DoricContext.create(this, DoricUtils.readAssetFile("demo.js"), "demo");
        doricContext.callEntity("log");
    }
}
