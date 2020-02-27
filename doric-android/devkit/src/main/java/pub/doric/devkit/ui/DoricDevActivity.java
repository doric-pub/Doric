package pub.doric.devkit.ui;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.google.gson.JsonObject;
import com.tbruyelle.rxpermissions2.RxPermissions;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.devkit.DevKit;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.IDevKit;
import pub.doric.devkit.R;
import pub.doric.devkit.event.ConnectExceptionEvent;
import pub.doric.devkit.event.EOFExceptionEvent;
import pub.doric.devkit.event.OpenEvent;
import pub.doric.devkit.event.StartDebugEvent;

public class DoricDevActivity extends AppCompatActivity {

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EventBus.getDefault().register(this);

        if (DoricDev.getInstance().devKitConnected) {
            setContentView(R.layout.layout_debug_context);
            initViews();
        } else {
            if (DevKit.isRunningInEmulator) {
                DevKit.ip = "10.0.2.2";
                DevKit.getInstance().connectDevKit("ws://" + DevKit.ip + ":7777");
            } else {
                final RxPermissions rxPermissions = new RxPermissions(this);
                Disposable disposable = rxPermissions
                        .request(Manifest.permission.CAMERA)
                        .subscribe(new Consumer<Boolean>() {
                            @Override
                            public void accept(Boolean grant) throws Exception {
                                if (grant) {
                                    Intent intent = new Intent(DoricDevActivity.this, ScanQRCodeActivity.class);
                                    startActivity(intent);
                                }
                            }
                        });
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
        setContentView(R.layout.layout_debug_context);
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
                    EventBus.getDefault().post(new StartDebugEvent(doricContext.getContextId()));
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("contextId", doricContext.getContextId());
                    jsonObject.addProperty("source", doricContext.getSource().replace(".js", ".ts"));
                    DevKit.getInstance().sendDevCommand(IDevKit.Command.DEBUG, jsonObject);
                }
            });

            container.addView(cell);
        }
    }
}
