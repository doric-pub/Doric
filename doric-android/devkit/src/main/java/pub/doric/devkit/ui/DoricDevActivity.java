package pub.doric.devkit.ui;

import android.Manifest;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageManager;
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
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
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
        private Bitmap icon_snapshot;
        private String debug_off = "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";
        private String debug_on = "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";
        private String snapshot = "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";

        private ContextCellAdapter() {
            this.contexts.addAll(DoricContextManager.aliveContexts());
            this.icon_off = getIcon(debug_off);
            this.icon_on = getIcon(debug_on);
            this.icon_snapshot = getIcon(snapshot);
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
                    list.add("Snapshot rollback");
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
                            } else if ("Snapshot rollback".endsWith(items[which])) {
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
