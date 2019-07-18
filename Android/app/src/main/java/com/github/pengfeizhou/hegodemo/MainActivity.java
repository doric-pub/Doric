package com.github.pengfeizhou.hegodemo;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;

import com.github.pengfeizhou.hego.HegoContext;
import com.github.pengfeizhou.hego.utils.HegoUtils;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        HegoContext hegoContext = HegoContext.createContext(HegoUtils.readAssetFile("demo.js"), "demo");
        hegoContext.callEntity("log");
    }
}
