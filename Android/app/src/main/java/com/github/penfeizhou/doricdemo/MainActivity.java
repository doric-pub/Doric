package com.github.penfeizhou.doricdemo;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.ViewGroup;
import android.widget.FrameLayout;

import com.github.penfeizhou.doric.Doric;
import com.github.penfeizhou.doric.DoricContext;
import com.github.penfeizhou.doric.dev.LocalServer;
import com.github.penfeizhou.doric.utils.DoricUtils;
import com.github.pengfeizhou.jscore.JSONBuilder;

import java.io.IOException;


public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        DoricContext doricContext = DoricContext.create(this, DoricUtils.readAssetFile("demo/Snake.js"), "test");
        doricContext.init(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
        doricContext.callEntity("log");
        doricContext.getRootNode().setRootView((FrameLayout) findViewById(R.id.root));
        Doric.connectDevKit("ws://192.168.11.38:7777");
        LocalServer localServer = new LocalServer(getApplicationContext(), 8910);
        try {
            localServer.start();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
