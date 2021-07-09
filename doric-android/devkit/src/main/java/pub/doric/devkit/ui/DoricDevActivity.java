package pub.doric.devkit.ui;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.ColorStateList;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.SwitchCompat;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import java.nio.charset.Charset;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Locale;

import pub.doric.DoricContext;
import pub.doric.DoricContextManager;
import pub.doric.DoricRegistry;
import pub.doric.devkit.DoricDebugDriver;
import pub.doric.devkit.DoricDev;
import pub.doric.devkit.R;
import pub.doric.devkit.qrcode.DisplayUtil;
import pub.doric.devkit.qrcode.activity.CaptureActivity;
import pub.doric.devkit.qrcode.activity.CodeUtils;

public class DoricDevActivity extends AppCompatActivity implements DoricDev.StatusCallback {
    private int REQUEST_CODE = 100;
    private ContextCellAdapter cellAdapter;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        DisplayUtil.initDisplayOpinion(getApplicationContext());
        setContentView(R.layout.layout_debug_context);
        initHeaders();
        initList();
    }

    private void initList() {
        RecyclerView recyclerView = findViewById(R.id.list);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        this.cellAdapter = new ContextCellAdapter();
        recyclerView.setAdapter(this.cellAdapter);
    }

    @Override
    protected void onStart() {
        super.onStart();
        DoricDev.getInstance().addStatusCallback(this);
    }

    @Override
    protected void onStop() {
        super.onStop();
        DoricDev.getInstance().removeStatusCallback(this);
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
                DoricDev.getInstance().connectDevKit("ws://" + result + ":7777");
            }
        }
    }


    private void initHeaders() {
        TextView tvConnection = findViewById(R.id.tv_connect_info);
        TextView tvInput = findViewById(R.id.tv_input);
        TextView tvScan = findViewById(R.id.tv_scan);
        TextView tvDisconnect = findViewById(R.id.tv_disconnect);
        if (DoricDev.getInstance().isInDevMode()) {
            tvConnection.setText(DoricDev.getInstance().getIP());
            tvInput.setVisibility(View.GONE);
            tvScan.setVisibility(View.GONE);
            tvDisconnect.setVisibility(View.VISIBLE);
            tvConnection.setBackgroundColor(Color.parseColor("#2ed573"));
        } else {
            tvConnection.setText("Disconnected");
            tvDisconnect.setVisibility(View.GONE);
            tvInput.setVisibility(View.VISIBLE);
            tvScan.setVisibility(View.VISIBLE);
            tvConnection.setBackgroundColor(Color.parseColor("#a4b0be"));
        }

        tvScan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (DoricDev.getInstance().isRunningInEmulator) {
                    DoricDev.getInstance().connectDevKit("ws://" + "10.0.2.2" + ":7777");
                } else {
                    if (ContextCompat.checkSelfPermission(DoricDevActivity.this, Manifest.permission.CAMERA)
                            != PackageManager.PERMISSION_GRANTED) {
                        if (ActivityCompat.shouldShowRequestPermissionRationale(DoricDevActivity.this,
                                Manifest.permission.CAMERA)) {
                        } else {
                            ActivityCompat.requestPermissions(DoricDevActivity.this,
                                    new String[]{Manifest.permission.CAMERA,}, 1);
                        }
                    } else {
                        Intent intent = new Intent(DoricDevActivity.this, CaptureActivity.class);
                        startActivityForResult(intent, REQUEST_CODE);
                    }
                }
            }
        });

        tvInput.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View clickView) {
                if (DoricDev.getInstance().isRunningInEmulator) {
                    DoricDev.getInstance().connectDevKit("ws://" + "10.0.2.2" + ":7777");
                } else {
                    AlertDialog.Builder builder = new AlertDialog.Builder(DoricDevActivity.this, R.style.Theme_Doric_Modal_Prompt);
                    builder.setTitle("Please input devkit ip");
                    View v = LayoutInflater.from(DoricDevActivity.this).inflate(R.layout.doric_modal_prompt, null);
                    final EditText editText = v.findViewById(R.id.edit_input);
                    editText.setHint("192.168.1.1");
                    String ip = DoricDev.getInstance().getIP();
                    if (!TextUtils.isEmpty(ip)) {
                        editText.setText(ip);
                        editText.setSelection(ip.length());
                    }
                    builder.setView(v);
                    builder
                            .setPositiveButton(android.R.string.ok, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    String ip = editText.getText().toString();
                                    DoricDev.getInstance().connectDevKit("ws://" + ip + ":7777");
                                }
                            })
                            .setNegativeButton(android.R.string.cancel, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                }
                            });
                    builder.show();
                }
            }
        });
        tvDisconnect.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                DoricDev.getInstance().closeDevMode();
            }
        });
        SwitchCompat snapshotSwitch = findViewById(R.id.switch_snapshot);
        snapshotSwitch.setChecked(DoricRegistry.isEnableRenderSnapshot());
        snapshotSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                DoricRegistry.enableRenderSnapshot(isChecked);
            }
        });
        setSwitch(snapshotSwitch);

        SwitchCompat profileSwitch = findViewById(R.id.switch_profile);
        profileSwitch.setChecked(DoricRegistry.isEnablePerformance());
        profileSwitch.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                DoricRegistry.enablePerformance(isChecked);
            }
        });
        setSwitch(profileSwitch);
    }

    private void setSwitch(SwitchCompat switchCompat) {
        ColorStateList trackTintList = new ColorStateList(new int[][]{
                new int[]{android.R.attr.state_checked}, new int[]{}},
                new int[]{Color.parseColor("#2ed573"), Color.parseColor("#a4b0be")});
        switchCompat.setTrackTintList(trackTintList);

        ColorStateList thumbTintList = new ColorStateList(new int[][]{
                new int[]{android.R.attr.state_checked}, new int[]{}},
                new int[]{Color.WHITE, Color.WHITE});
        switchCompat.setThumbTintList(thumbTintList);
    }


    @Override
    public void onOpen(String url) {
        initHeaders();
        this.cellAdapter.notifyDataSetChanged();
    }

    @Override
    public void onClose(String url) {
        initHeaders();
        this.cellAdapter.notifyDataSetChanged();
    }

    @Override
    public void onFailure(Throwable throwable) {
        initHeaders();
        this.cellAdapter.notifyDataSetChanged();
    }

    @Override
    public void onReload(DoricContext context, String script) {
        this.cellAdapter.notifyDataSetChanged();
    }

    @Override
    public void onStartDebugging(DoricContext context) {
        this.cellAdapter.notifyDataSetChanged();
    }

    @Override
    public void onStopDebugging() {
        this.cellAdapter.notifyDataSetChanged();
    }

    private static class ContextCellHolder extends RecyclerView.ViewHolder {
        public TextView tvId;
        public TextView tvSource;
        public ImageView ivDebug;
        public View layoutBtn;

        public ContextCellHolder(@NonNull View itemView) {
            super(itemView);
        }
    }

    private static String toHex(byte[] bytes) {
        char[] hexDigits = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'};
        char[] resultCharArray = new char[bytes.length * 2];
        int index = 0;
        for (byte b : bytes) {
            resultCharArray[index++] = hexDigits[b >>> 4 & 0xf];
            resultCharArray[index++] = hexDigits[b & 0xf];
        }
        return new String(resultCharArray);
    }

    private static String md5(String s) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] bytes = md.digest(s.getBytes(Charset.forName("UTF-8")));
            return toHex(bytes);
        } catch (Exception e) {
            return "";
        }
    }

    private static class ContextCellAdapter extends RecyclerView.Adapter<ContextCellHolder> {
        private final ArrayList<DoricContext> contexts = new ArrayList<>();
        private Bitmap icon_off;
        private Bitmap icon_on;
        private String debug_off = "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";
        private String debug_on = "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";

        private ContextCellAdapter() {
            this.contexts.addAll(DoricContextManager.aliveContexts());
            this.icon_off = getIcon(debug_off);
            this.icon_on = getIcon(debug_on);
        }

        private Bitmap getIcon(String str) {
            byte[] data = Base64.decode(str, Base64.DEFAULT);
            return BitmapFactory.decodeByteArray(data, 0, data.length);
        }

        @NonNull
        @Override
        public ContextCellHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
            View cell = LayoutInflater.from(parent.getContext()).inflate(R.layout.layout_debug_context_cell, parent, false);
            ContextCellHolder cellHolder = new ContextCellHolder(cell);
            cellHolder.tvId = cell.findViewById(R.id.context_id_text_view);
            cellHolder.tvSource = cell.findViewById(R.id.source_text_view);
            cellHolder.ivDebug = cell.findViewById(R.id.icon_debug);
            cellHolder.layoutBtn = cell.findViewById(R.id.layout_btn);
            return cellHolder;
        }

        @Override
        public void onBindViewHolder(@NonNull final ContextCellHolder holder, int position) {
            final DoricContext context = contexts.get(position);
            holder.tvId.setText(context.getContextId());
            holder.tvSource.setText(context.getSource());
            holder.ivDebug.setImageBitmap(DoricDev.getInstance().isInDevMode() ? icon_on : icon_off);
            holder.itemView.setBackgroundColor(position % 2 == 0 ? Color.parseColor("#ecf0f1") : Color.parseColor("#bdc3c7"));
            if (DoricDev.getInstance().isReloadingContext(context)) {
                holder.itemView.setBackgroundColor(Color.parseColor("#ffeaa7"));
            }
            if (context.getDriver() instanceof DoricDebugDriver) {
                holder.itemView.setBackgroundColor(Color.parseColor("#fab1a0"));
            }
            holder.layoutBtn.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(final View v) {
                    ArrayList<String> list = new ArrayList<>();
                    list.add("View source");
                    if (DoricDev.getInstance().isInDevMode()) {
                        if (context.getDriver() instanceof DoricDebugDriver) {
                            list.add("Stop debugging");
                        } else {
                            list.add("Start debugging");
                        }
                    }
                    if (DoricRegistry.isEnableRenderSnapshot()) {
                        list.add("Snapshot");
                    }
                    final String[] items = list.toArray(new String[0]);
                    AlertDialog.Builder builder = new AlertDialog.Builder(holder.itemView.getContext(), R.style.Theme_Doric_Modal);
                    builder.setTitle(String.format("%s %s", context.getContextId(), context.getSource()));
                    builder.setIcon(new BitmapDrawable(holder.itemView.getContext().getResources(), icon_on));
                    builder.setItems(items, new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            if ("View source".equals(items[which])) {
                                AlertDialog.Builder builder = new AlertDialog.Builder(holder.itemView.getContext(), R.style.Theme_Doric_Modal_Alert);
                                builder.setTitle(String.format(Locale.getDefault(),
                                        "View source: %s",
                                        context.getSource()));
                                String btnTitle = holder.itemView.getContext().getString(android.R.string.ok);
                                builder.setMessage(
                                        String.format(Locale.getDefault(),
                                                "Size:%d\nMD5:%s\nScript:\n%s",
                                                context.getScript().length(),
                                                md5(context.getScript()),
                                                context.getScript()))
                                        .setPositiveButton(btnTitle, new DialogInterface.OnClickListener() {
                                            @Override
                                            public void onClick(DialogInterface dialog, int which) {
                                                dialog.dismiss();
                                            }
                                        });
                                builder.setCancelable(false);
                                builder.show();
                            } else if ("Stop debugging".equals(items[which])) {
                                DoricDev.getInstance().stopDebugging(true);
                            } else if ("Start debugging".equals(items[which])) {
                                DoricDev.getInstance().requestDebugging(context);
                            } else if ("Snapshot".endsWith(items[which])) {
                                Activity activity = (Activity) context.getContext();
                                ViewGroup view = (ViewGroup) activity.getWindow().getDecorView();
                                DoricSnapshotView doricSnapshotView = new DoricSnapshotView(activity, context);
                                FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
                                layoutParams.topMargin = 200;
                                view.addView(doricSnapshotView, layoutParams);
                                ((Activity) v.getContext()).finish();
                            }
                            dialog.dismiss();
                        }
                    });
                    builder.create().show();
                }
            });
        }

        @Override
        public int getItemCount() {
            return this.contexts.size();
        }
    }
}
