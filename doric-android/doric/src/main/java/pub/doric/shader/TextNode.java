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

import android.util.TypedValue;
import android.view.Gravity;
import android.widget.TextView;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;

import com.github.pengfeizhou.jscore.JSValue;

/**
 * @Description: widget
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-20
 */
@DoricPlugin(name = "Text")
public class TextNode extends ViewNode<TextView> {
    public TextNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected TextView build() {
        TextView tv = new TextView(getContext());
        tv.setGravity(Gravity.CENTER);
        return tv;
    }

    @Override
    protected void blend(TextView view, String name, JSValue prop) {
        switch (name) {
            case "text":
                view.setText(prop.asString().toString());
                break;
            case "textSize":
                view.setTextSize(TypedValue.COMPLEX_UNIT_DIP, prop.asNumber().toFloat());
                break;
            case "textColor":
                view.setTextColor(prop.asNumber().toInt());
                break;
            case "textAlignment":
                view.setGravity(prop.asNumber().toInt() | Gravity.CENTER_VERTICAL);
                break;
            case "numberOfLines":
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
