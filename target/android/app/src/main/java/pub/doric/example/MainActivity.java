package pub.doric.example;


import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricPanel;
import pub.doric.utils.DoricUtils;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "__$__";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        DoricPanel doricPanel = findViewById(R.id.doric_panel);
        doricPanel.config(DoricUtils.readAssetFile(BUNDLE_NAME + ".js"), BUNDLE_NAME);
    }
}
