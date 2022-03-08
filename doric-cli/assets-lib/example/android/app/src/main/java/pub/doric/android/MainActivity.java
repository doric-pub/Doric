package pub.doric.android;

import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import pub.doric.DoricFragment;
import pub.doric.devkit.DoricDev;
import pub.doric.navbar.BaseDoricNavBar;

public class MainActivity extends AppCompatActivity {
    private final String BUNDLE_NAME = "Example";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        String source = "assets://src/" + BUNDLE_NAME + ".js";
        getIntent().putExtra("source", source);
        getIntent().putExtra("alias", BUNDLE_NAME);
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        if (savedInstanceState == null) {
            this.getSupportFragmentManager().beginTransaction().add(R.id.container, new DoricFragment()).commit();
        }
        BaseDoricNavBar doricNavBar = findViewById(R.id.doric_nav_bar);
        doricNavBar.setBackIconVisible(false);

        TextView textView = new TextView(this);
        textView.setText("Devkit");
        textView.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DoricDev.getInstance().openDevMode();
            }
        });
        textView.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT));
        doricNavBar.setRight(textView);
    }
}
