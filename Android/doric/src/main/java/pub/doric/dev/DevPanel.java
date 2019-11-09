package pub.doric.dev;

import android.Manifest;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.google.android.material.bottomsheet.BottomSheetDialogFragment;
import com.tbruyelle.rxpermissions2.RxPermissions;

import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Consumer;
import pub.doric.R;

public class DevPanel extends BottomSheetDialogFragment {

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

        getView().findViewById(R.id.menu1_text_view).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                final RxPermissions rxPermissions = new RxPermissions(DevPanel.this);
                Disposable disposable = rxPermissions
                        .request(Manifest.permission.CAMERA)
                        .subscribe(new Consumer<Boolean>() {
                            @Override
                            public void accept(Boolean grant) throws Exception {
                                if (grant){
                                    Intent intent = new Intent(getContext(), ScanQRCodeActivity.class);
                                    getContext().startActivity(intent);
                                }
                            }
                        });

            }
        });
    }
}
