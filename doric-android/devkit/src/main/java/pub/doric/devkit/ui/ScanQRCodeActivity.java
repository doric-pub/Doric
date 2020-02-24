package pub.doric.devkit.ui;

import android.os.Bundle;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import cn.bingoogolapple.qrcode.core.QRCodeView;
import cn.bingoogolapple.qrcode.zbar.ZBarView;
import pub.doric.devkit.DevKit;
import pub.doric.devkit.R;

public class ScanQRCodeActivity extends AppCompatActivity implements QRCodeView.Delegate {

    private ZBarView mZbarView;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.layout_scan_qrcode);
        mZbarView = findViewById(R.id.zbar_view);
        mZbarView.setDelegate(this);
    }

    @Override
    protected void onStart() {
        super.onStart();

        mZbarView.startCamera();
        mZbarView.startSpotAndShowRect();
    }

    @Override
    protected void onStop() {
        super.onStop();

        mZbarView.stopCamera();
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        mZbarView.onDestroy();
        super.onDestroy();
    }

    @Override
    public void onScanQRCodeSuccess(String result) {
        setTitle("扫描结果为：" + result);
        DevKit.ip = result;
        Toast.makeText(this, "dev kit connecting to " + result, Toast.LENGTH_LONG).show();
        DevKit.getInstance().connectDevKit("ws://" + result + ":7777");
        finish();
    }

    @Override
    public void onCameraAmbientBrightnessChanged(boolean isDark) {
        String tipText = mZbarView.getScanBoxView().getTipText();
        String ambientBrightnessTip = "\n环境过暗，请打开闪光灯";
        if (isDark) {
            if (!tipText.contains(ambientBrightnessTip)) {
                mZbarView.getScanBoxView().setTipText(tipText + ambientBrightnessTip);
            }
        } else {
            if (tipText.contains(ambientBrightnessTip)) {
                tipText = tipText.substring(0, tipText.indexOf(ambientBrightnessTip));
                mZbarView.getScanBoxView().setTipText(tipText);
            }
        }
    }

    @Override
    public void onScanQRCodeOpenCameraError() {
        System.out.println();
    }
}
