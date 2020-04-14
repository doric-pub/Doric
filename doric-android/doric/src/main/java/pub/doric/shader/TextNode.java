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

import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.text.Html;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.TextView;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.richtext.CustomTagHandler;
import pub.doric.shader.richtext.HtmlParser;
import pub.doric.utils.DoricUtils;

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
        tv.setMaxLines(1);
        tv.setEllipsize(TextUtils.TruncateAt.END);
        tv.setIncludeFontPadding(false);
        return tv;
    }

    @Override
    protected void blendLayoutConfig(JSObject jsObject) {
        super.blendLayoutConfig(jsObject);
        JSValue maxWidth = jsObject.getProperty("maxWidth");
        if (maxWidth.isNumber()) {
            mView.setMaxWidth(DoricUtils.dp2px(maxWidth.asNumber().toFloat()));
        }
        JSValue maxHeight = jsObject.getProperty("maxHeight");
        if (maxHeight.isNumber()) {
            mView.setMaxHeight(DoricUtils.dp2px(maxWidth.asNumber().toFloat()));
        }
    }

    @Override
    protected void blend(TextView view, String name, JSValue prop) {
        switch (name) {
            case "text":
                if (!prop.isString()) {
                    return;
                }
                view.setText(prop.asString().toString());
                break;
            case "textSize":
                if (!prop.isNumber()) {
                    return;
                }
                view.setTextSize(TypedValue.COMPLEX_UNIT_DIP, prop.asNumber().toFloat());
                break;
            case "textColor":
                if (!prop.isNumber()) {
                    return;
                }
                view.setTextColor(prop.asNumber().toInt());
                break;
            case "textAlignment":
                if (!prop.isNumber()) {
                    return;
                }
                view.setGravity(prop.asNumber().toInt() | Gravity.CENTER_VERTICAL);
                break;
            case "maxLines":
                int line = prop.asNumber().toInt();
                if (line <= 0) {
                    line = Integer.MAX_VALUE;
                }
                view.setMaxLines(line);
                break;
            case "fontStyle":
                if (prop.isString()) {
                    if ("bold".equals(prop.asString().value())) {
                        view.setTypeface(Typeface.defaultFromStyle(Typeface.BOLD));
                    } else if ("italic".equals(prop.asString().value())) {
                        view.setTypeface(Typeface.defaultFromStyle(Typeface.ITALIC));
                    } else if ("bold_italic".equals(prop.asString().value())) {
                        view.setTypeface(Typeface.defaultFromStyle(Typeface.BOLD_ITALIC));
                    } else {
                        view.setTypeface(Typeface.defaultFromStyle(Typeface.NORMAL));
                    }
                } else {
                    view.setTypeface(Typeface.defaultFromStyle(Typeface.NORMAL));
                }
                break;
            case "font":
                if (!prop.isString()) {
                    return;
                }
                String font = prop.asString().toString();
                if (font.endsWith(".ttf")) {
                    Typeface iconFont = Typeface.createFromAsset(getContext().getAssets(), font);
                    view.setTypeface(iconFont);
                } else {
                    Typeface iconFont = Typeface.createFromAsset(getContext().getAssets(), font + ".ttf");
                    view.setTypeface(iconFont);
                }

                break;
            case "maxWidth":
                if (!prop.isNumber()) {
                    return;
                }
                view.setMaxWidth(DoricUtils.dp2px(prop.asNumber().toFloat()));
                break;
            case "maxHeight":
                if (!prop.isNumber()) {
                    return;
                }
                view.setMaxHeight(DoricUtils.dp2px(prop.asNumber().toFloat()));
                break;
            case "lineSpacing":
                if (!prop.isNumber()) {
                    return;
                }
                view.setLineSpacing(DoricUtils.dp2px(prop.asNumber().toFloat()), 1);
                break;
            case "strikethrough":
                if (prop.isBoolean()) {
                    view.getPaint().setStrikeThruText(prop.asBoolean().value());
                }
                break;
            case "underline":
                if (prop.isBoolean()) {
                    view.getPaint().setUnderlineText(prop.asBoolean().value());
                }
                break;
            case "htmlText":
                if (prop.isString()) {
                    view.setText(
                            HtmlParser.buildSpannedText(prop.asString().value(),
                                    new Html.ImageGetter() {
                                        @Override
                                        public Drawable getDrawable(String source) {
                                            return null;
                                        }
                                    },
                                    new CustomTagHandler()));
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }
}
