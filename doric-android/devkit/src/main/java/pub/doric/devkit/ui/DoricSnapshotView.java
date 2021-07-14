/*
 * Copyright [2021] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package pub.doric.devkit.ui;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.text.TextUtils;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;

import com.github.pengfeizhou.jscore.ArchiveException;
import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSObject;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.devkit.R;
import pub.doric.shader.RootNode;
import pub.doric.shader.ViewNode;
import pub.doric.utils.ThreadMode;

/**
 * @Description: pub.doric.devkit.ui
 * @Author: pengfei.zhou
 * @CreateDate: 2021/7/9
 */
@SuppressLint("ViewConstructor")
public class DoricSnapshotView extends DoricFloatingView {
    private final DoricContext doricContext;
    private int snapNo = -1;
    private int snapSize = 0;
    private TextView snapIndex;
    private ImageView spanPre;
    private ImageView spanNext;

    public DoricSnapshotView(@NonNull Context context, DoricContext doricContext) {
        super(context);
        this.doricContext = doricContext;
        initView(context);
        this.setAlpha(0.8f);
    }

    private void initView(Context context) {
        LayoutInflater.from(context).inflate(R.layout.layout_doric_dev_view_snapshot, this);
        snapIndex = findViewById(R.id.snap_idx);
        spanPre = findViewById(R.id.snap_pre);
        spanNext = findViewById(R.id.snap_next);
        findViewById(R.id.snap_close).setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                rollupSnapshot(snapSize);
                ((ViewGroup) (DoricSnapshotView.this.getParent())).removeView(DoricSnapshotView.this);
            }
        });
        this.doricContext.callEntity("__renderSnapshotDepth__").setCallback(new AsyncResult.Callback<JSDecoder>() {
            @Override
            public void onResult(final JSDecoder result) {
                snapIndex.post(new Runnable() {
                    @Override
                    public void run() {
                        try {
                            snapSize = result.decode().asNumber().toInt();
                        } catch (ArchiveException e) {
                            e.printStackTrace();
                        }
                        snapNo = snapSize;
                        rollupSnapshot(snapNo);
                        spanPre.setOnClickListener(new OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (snapNo <= 0) {
                                    return;
                                }
                                snapNo--;
                                rollupSnapshot(snapNo);
                            }
                        });
                        spanNext.setOnClickListener(new OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                if (snapNo >= snapSize) {
                                    return;
                                }
                                snapNo++;
                                rollupSnapshot(snapNo);
                            }
                        });

                    }
                });
            }

            @Override
            public void onError(Throwable t) {

            }

            @Override
            public void onFinish() {

            }
        });

    }

    private void rollupSnapshot(int index) {
        spanPre.setImageAlpha(index <= 0 ? 0x7f : 0xff);
        spanNext.setImageAlpha(index >= snapSize ? 0x7f : 0xff);
        snapIndex.setText(String.valueOf(index));
        doricContext.callEntity("__restoreRenderSnapshot__", index).setCallback(new AsyncResult.Callback<JSDecoder>() {
            @Override
            public void onResult(JSDecoder result) {
                try {
                    final JSArray jsArray = result.decode().asArray();

                    doricContext.getDriver().asyncCall(new Callable<Object>() {
                        @Override
                        public Object call() {
                            if (doricContext.getContext() instanceof Activity) {
                                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR1
                                        && ((Activity) doricContext.getContext()).isDestroyed()) {
                                    return null;
                                }
                            }
                            doricContext.getRootNode().getView().removeAllViews();
                            doricContext.getRootNode().clearSubModel();
                            for (int i = 0; i < jsArray.size(); i++) {
                                JSObject jsObject = jsArray.get(i).asObject();
                                String viewId = jsObject.getProperty("id").asString().value();

                                RootNode rootNode = doricContext.getRootNode();
                                if (TextUtils.isEmpty(rootNode.getId()) && "Root".equals(jsObject.getProperty("type").asString().value())) {
                                    rootNode.setId(viewId);
                                    rootNode.blend(jsObject.getProperty("props").asObject());
                                } else {
                                    ViewNode viewNode = doricContext.targetViewNode(viewId);
                                    if (viewNode != null) {
                                        viewNode.blend(jsObject.getProperty("props").asObject());
                                    }
                                }
                            }
                            return null;
                        }
                    }, ThreadMode.UI);

                } catch (ArchiveException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(Throwable t) {

            }

            @Override
            public void onFinish() {

            }
        });
    }
}
