package pub.doric.example;

import android.os.Bundle;

import pub.doric.DoricActivity;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "__$__";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String source = "assets://src/" + BUNDLE_NAME + ".js";
        getIntent().putExtra("source", source);
        getIntent().putExtra("alias", BUNDLE_NAME);
        super.onCreate(savedInstanceState);
        BaseDoricNavBar doricNavBar = findViewById(R.id.doric_nav_bar);
        doricNavBar.setBackIconVisible(false);
    }
}
