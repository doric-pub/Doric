package pub.doric.example;


import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricFragment;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "__$__";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (savedInstanceState == null) {
            String source = "assets://src/" + BUNDLE_NAME + ".js";
            getIntent().putExtra("source", source);
            getIntent().putExtra("alias", BUNDLE_NAME);
            this.getSupportFragmentManager().beginTransaction().add(R.id.root, new DoricFragment()).commit();
        }
    }
}
