package pub.doric.dev;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.tbruyelle.rxpermissions2.RxPermissions;

import org.greenrobot.eventbus.EventBus;
import org.greenrobot.eventbus.Subscribe;
import org.greenrobot.eventbus.ThreadMode;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.R;
import pub.doric.dev.event.EOFEvent;
import pub.doric.dev.event.OpenEvent;

public class DevPanel extends BottomSheetDialogFragment {

    private boolean isDevConnected = false;

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

        getView().findViewById(R.id.connect_dev_kit_text_view).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
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
        });
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        EventBus.getDefault().register(this);
    }

    @Override
    public void onDetach() {
        super.onDetach();
        EventBus.getDefault().unregister(this);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onOpenEvent(OpenEvent openEvent) {
        isDevConnected = true;

        getView().findViewById(R.id.connect_dev_kit_text_view).setVisibility(View.GONE);
        getView().findViewById(R.id.debug_text_view).setVisibility(View.VISIBLE);
        getView().findViewById(R.id.hot_reload_text_view).setVisibility(View.VISIBLE);
    }

    @Subscribe(threadMode = ThreadMode.MAIN)
    public void onEOFEvent(EOFEvent eofEvent) {
        isDevConnected = false;

        getView().findViewById(R.id.connect_dev_kit_text_view).setVisibility(View.VISIBLE);
        getView().findViewById(R.id.debug_text_view).setVisibility(View.GONE);
        getView().findViewById(R.id.hot_reload_text_view).setVisibility(View.GONE);
    }
}
