package pub.doric.dev;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.google.gson.JsonObject;
import com.lahm.library.EasyProtectorLib;
import com.lahm.library.EmulatorCheckCallback;
import com.tbruyelle.rxpermissions2.RxPermissions;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.BuildConfig;
import pub.doric.Doric;
import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.R;
import pub.doric.dev.event.ConnectExceptionEvent;
import pub.doric.dev.event.EOFExceptionEvent;
import pub.doric.dev.event.OpenEvent;

public class DevPanel extends BottomSheetDialogFragment {

    private boolean isRunningInEmulator = false;
    static boolean isDevConnected = false;

    public DevPanel() {

    }

    @Nullable
    @Override
    public View onCreateView(
            @NonNull LayoutInflater inflater,
            @Nullable ViewGroup container,
            @Nullable Bundle savedInstanceState
    ) {
        return inflater.inflate(R.layout.layout_dev, container, false);
    }

    @Override
    public void onStart() {
        super.onStart();

        updateUI();

        getView().findViewById(R.id.connect_dev_kit_text_view).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (isRunningInEmulator) {
                    Doric.connectDevKit("ws://" + "10.0.2.2" + ":7777");
                } else {
                    final RxPermissions rxPermissions = new RxPermissions(DevPanel.this);
                    Disposable disposable = rxPermissions
                            .request(Manifest.permission.CAMERA)
                            .subscribe(new Consumer<Boolean>() {
                                @Override
                                public void accept(Boolean grant) throws Exception {
                                    if (grant) {
                                        Intent intent = new Intent(getContext(), ScanQRCodeActivity.class);
                                        getContext().startActivity(intent);
                                    }
                                }
                            });
                }
            }
        });

        getView().findViewById(R.id.debug_text_view).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                for (DoricContext doricContext : DoricContextManager.aliveContexts()) {
                    JsonObject jsonObject = new JsonObject();
                    jsonObject.addProperty("contextId", doricContext.getContextId());
                    jsonObject.addProperty("projectHome", BuildConfig.PROJECT_HOME);
                    Doric.sendDevCommand(IDevKit.Command.DEBUG, jsonObject);
                }
                dismissAllowingStateLoss();
            }
        });
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        EventBus.getDefault().register(this);
        isRunningInEmulator = EasyProtectorLib.checkIsRunningInEmulator(context, new EmulatorCheckCallback() {
            @Override
            public void findEmulator(String emulatorInfo) {
                System.out.println(emulatorInfo);
            }
        });
    }

    @Override
    public void onDetach() {
        super.onDetach();
        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onOpenEvent(OpenEvent openEvent) {
        updateUI();
        Toast.makeText(getContext(), "dev kit connected", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEOFEvent(EOFExceptionEvent eofExceptionEvent) {
        updateUI();
        Toast.makeText(getContext(), "dev kit eof exception", Toast.LENGTH_LONG).show();
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onConnectExceptionEvent(ConnectExceptionEvent connectExceptionEvent) {
        updateUI();
        Toast.makeText(getContext(), "dev kit connection exception", Toast.LENGTH_LONG).show();
    }

    private void updateUI() {
        if (isDevConnected) {
            getView().findViewById(R.id.connect_dev_kit_text_view).setVisibility(View.GONE);
            getView().findViewById(R.id.debug_text_view).setVisibility(View.VISIBLE);
            getView().findViewById(R.id.hot_reload_text_view).setVisibility(View.VISIBLE);
        } else {
            getView().findViewById(R.id.connect_dev_kit_text_view).setVisibility(View.VISIBLE);
            getView().findViewById(R.id.debug_text_view).setVisibility(View.GONE);
            getView().findViewById(R.id.hot_reload_text_view).setVisibility(View.GONE);
        }
    }
}
