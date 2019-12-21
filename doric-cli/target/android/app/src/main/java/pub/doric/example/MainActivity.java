package pub.doric.example;


import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import pub.doric.DoricFragment;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "__$__";
    private DoricFragment doricFragment;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (savedInstanceState == null) {
            String scheme = "assets://" + BUNDLE_NAME + ".js";
            this.doricFragment = DoricFragment.newInstance(scheme, BUNDLE_NAME);
            this.getSupportFragmentManager().beginTransaction().add(R.id.root, this.doricFragment).commit();
        }
    }

    @Override
    public void onBackPressed() {
        if (this.doricFragment.canPop()) {
            this.doricFragment.pop();
        } else {
            super.onBackPressed();
        }
    }
}
