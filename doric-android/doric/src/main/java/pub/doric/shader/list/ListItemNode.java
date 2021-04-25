/*
 * Copyright [2019] [Doric.Pub]
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
package pub.doric.shader.list;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.view.View;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSArray;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.ArrayList;
import java.util.List;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.StackNode;

/**
 * @Description: com.github.penfeizhou.doric.widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-12
 */
@DoricPlugin(name = "ListItem")
public class ListItemNode extends StackNode {
    public String identifier = "";
    private JSArray actions = null;

    public ListItemNode(DoricContext doricContext) {
        super(doricContext);
        this.mReusable = true;
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("actions".equals(name)) {
            if (prop.isArray()) {
                this.actions = prop.asArray();
            }
        } else if ("identifier".equals(name)) {
            this.identifier = prop.asString().value();
        } else {
            super.blend(view, name, prop);
        }
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        getNodeView().getLayoutParams().width = getLayoutParams().width;
        getNodeView().getLayoutParams().height = getLayoutParams().height;
        if (this.actions != null && this.actions.size() > 0) {
            getView().setOnLongClickListener(new View.OnLongClickListener() {
                @Override
                public boolean onLongClick(View v) {
                    if (actions == null || actions.size() == 0) {
                        return false;
                    }
                    String[] items = new String[actions.size()];
                    final String[] callbacks = new String[actions.size()];
                    for (int i = 0; i < actions.size(); i++) {
                        JSObject action = actions.get(i).asObject();
                        String title = action.getProperty("title").asString().value();
                        String callback = action.getProperty("callback").asString().value();
                        items[i] = title;
                        callbacks[i] = callback;
                    }
                    new AlertDialog.Builder(getContext())
                            .setItems(items, new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int which) {
                                    callJSResponse(callbacks[which]);
                                    dialog.dismiss();
                                }
                            }).show();
                    return true;
                }
            });
        }
    }
}
