package pub.doric.devkit.ui;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.DevKit;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.R;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.OpenEvent;
import pub.doric.devkit.qrcode.DisplayUtil;
import pub.doric.devkit.qrcode.activity.CaptureActivity;
import pub.doric.devkit.qrcode.activity.CodeUtils;

public class DoricDevActivity extends AppCompatActivity {
    private int REQUEST_CODE = 100;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);
        DisplayUtil.initDisplayOpinion(getApplicationContext());
        setContentView(R.layout.layout_debug_context);
        initDisconnect();
        if (DoricDev.getInstance().isInDevMode()) {
            initViews();
        } else {
            if (DevKit.isRunningInEmulator) {
                DevKit.ip = "10.0.2.2";
                DevKit.getInstance().connectDevKit("ws://" + DevKit.ip + ":7777");
            } else {
                if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
                    if (ActivityCompat.shouldShowRequestPermissionRationale(this,
                            Manifest.permission.CAMERA)) {
                    } else {
                        ActivityCompat.requestPermissions(this,
                                new String[]{Manifest.permission.CAMERA,}, 1);
                    }
                } else {
                    Intent intent = new Intent(DoricDevActivity.this, CaptureActivity.class);
                    startActivityForResult(intent, REQUEST_CODE);
                }
            }
        }
    }


    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 1) {
            for (int i = 0; i < permissions.length; i++) {
                if (grantResults[i] == PackageManager.PERMISSION_GRANTED) {
                    Intent intent = new Intent(DoricDevActivity.this, CaptureActivity.class);
                    startActivityForResult(intent, REQUEST_CODE);
                }
            }
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (null != data) {
            Bundle bundle = data.getExtras();
            if (bundle == null) {
                return;
            }
            if (bundle.getInt(CodeUtils.RESULT_TYPE) == CodeUtils.RESULT_SUCCESS) {
                String result = bundle.getString(CodeUtils.RESULT_STRING);
                DevKit.ip = result;
                Toast.makeText(this, "dev kit connecting to " + result, Toast.LENGTH_LONG).show();
                DevKit.getInstance().connectDevKit("ws://" + result + ":7777");
            }
        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onOpenEvent(OpenEvent openEvent) {
        initViews();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEOFEvent(EOFExceptionEvent eofExceptionEvent) {
        finish();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onConnectExceptionEvent(ConnectExceptionEvent connectExceptionEvent) {
        finish();
    }

    private void initDisconnect() {
        LinearLayout container = findViewById(R.id.container);
        Button button = new Button(this);
        button.setText("断开连接");
        button.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (DoricDev.getInstance().isInDevMode()) {
                    DoricDev.getInstance().closeDevMode();
                }
                finish();
            }
        });
        container.addView(button);
    }

    private void initViews() {
        LinearLayout container = findViewById(R.id.container);
        LayoutInflater inflater = LayoutInflater.from(this);
        for (final DoricContext doricContext : DoricContextManager.aliveContexts()) {
            View cell = inflater.inflate(R.layout.layout_debug_context_cell, container, false);

            TextView contextIdTextView = cell.findViewById(R.id.context_id_text_view);
            contextIdTextView.setText(doricContext.getContextId());

            TextView sourceTextView = cell.findViewById(R.id.source_text_view);
            sourceTextView.setText(doricContext.getSource());

            cell.findViewById(R.id.debug_text_view).setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                }
            });

            container.addView(cell);
        }
    }
}
