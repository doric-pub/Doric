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
package pub.doric.shader;

import android.content.res.ColorStateList;
import android.graphics.Color;
import android.support.v7.widget.SwitchCompat;
import android.widget.CompoundButton;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2020-03-13
 */
@DoricPlugin(name = "Switch")
public class SwitchNode extends ViewNode<SwitchCompat> {
    private int offTintColor = 0xffe6e6e6;
    private int onTintColor = 0xff52d769;
    private int thumbTintColor = Color.WHITE;

    public SwitchNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected SwitchCompat build() {
        return new SwitchCompat(getContext());
    }

    @Override
    protected void blend(SwitchCompat view, String name, JSValue prop) {
        switch (name) {
            case "state":
                view.setChecked(prop.asBoolean().value());
                break;
            case "onSwitch":
                final String callbackId = prop.asString().value();
                view.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                    @Override
                    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                        callJSResponse(callbackId, isChecked);
                    }
                });
                break;
            case "offTintColor":
                this.offTintColor = prop.asNumber().toInt();
                break;
            case "onTintColor":
                this.onTintColor = prop.asNumber().toInt();
                break;
            case "thumbTintColor":
                this.thumbTintColor = prop.asNumber().toInt();
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @DoricMethod
    public boolean getState() {
        return mView.isChecked();
    }

    @Override
    public void blend(JSObject jsObject) {
        super.blend(jsObject);
        ColorStateList thumbTintList = new ColorStateList(new int[][]{
                new int[]{android.R.attr.state_checked}, new int[]{}},
                new int[]{thumbTintColor, thumbTintColor});
        ColorStateList trackTintList = new ColorStateList(new int[][]{
                new int[]{android.R.attr.state_checked}, new int[]{}},
                new int[]{onTintColor, offTintColor});
        mView.setThumbTintList(thumbTintList);
        mView.setTrackTintList(trackTintList);
    }
}
