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

import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Shader;
import android.graphics.Typeface;
import android.graphics.drawable.Drawable;
import android.text.Html;
import android.text.Layout;
import android.text.TextUtils;
import android.util.TypedValue;
import android.view.Gravity;
import android.widget.TextView;

import androidx.core.content.res.ResourcesCompat;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.shader.richtext.CustomTagHandler;
import pub.doric.shader.richtext.HtmlParser;
import pub.doric.utils.DoricLog;
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
        tv.setSingleLine(true);
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
            mView.setMaxHeight(DoricUtils.dp2px(maxHeight.asNumber().toFloat()));
        }
    }

    @Override
    protected void blend(final TextView view, String name, final JSValue prop) {
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
                if (prop.isNumber()) {
                    view.setTextColor(prop.asNumber().toInt());
                } else if (prop.isObject()) {
                    view.post(new Runnable() {
                        @Override
                        public void run() {
                            final JSObject dict = prop.asObject();

                            LinearGradient linearGradient = null;

                            int[] colors = null;
                            float[] locations = null;

                            if (dict.propertySet().contains("colors")) {
                                JSValue colorsValue = dict.getProperty("colors");
                                if (colorsValue.isArray()) {
                                    colors = colorsValue.asArray().toIntArray();
                                }
                                if (dict.propertySet().contains("locations")) {
                                    JSValue locationsValue = dict.getProperty("locations");
                                    if (locationsValue.isArray()) {
                                        locations = locationsValue.asArray().toFloatArray();
                                    }
                                }
                            } else {
                                if (dict.propertySet().contains("start") && dict.propertySet().contains("end")) {
                                    JSValue start = dict.getProperty("start");
                                    JSValue end = dict.getProperty("end");
                                    if (start.isNumber() && end.isNumber()) {
                                        colors = new int[]{start.asNumber().toInt(), end.asNumber().toInt()};
                                    }
                                }
                            }
                            if (colors == null) {
                                colors = new int[]{Color.TRANSPARENT, Color.TRANSPARENT};
                            }

                            JSValue orientation = dict.getProperty("orientation");

                            float width = view.getMeasuredWidth();
                            float height = view.getMeasuredHeight();

                            float angle = 0;

                            if (orientation.isNumber()) {
                                switch (orientation.asNumber().toInt()) {
                                    case 0:
                                        angle = 270;
                                        break;
                                    case 1:
                                        angle = (float) Math.toDegrees(Math.atan2(-width, -height));
                                        break;
                                    case 2:
                                        angle = 180;
                                        break;
                                    case 3:
                                        angle = (float) Math.toDegrees(Math.atan2(width, -height));
                                        break;
                                    case 4:
                                        angle = 90;
                                        break;
                                    case 5:
                                        angle = (float) Math.toDegrees(Math.atan2(width, height));
                                        break;
                                    case 6:
                                        angle = 0;
                                        break;
                                    case 7:
                                        angle = (float) Math.toDegrees(Math.atan2(-width, height));
                                        break;
                                }
                            }

                            setGradientTextColor(view, angle, colors, locations);
                        }
                    });
                }
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
                view.setSingleLine(line == 1);
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
                String fontPath = "";
                String fontName = font;
                if (font.contains("/")) {
                    int separatorIndex = font.lastIndexOf("/");
                    fontPath = font.substring(0, separatorIndex + 1);
                    fontName = font.substring(separatorIndex + 1);
                }

                if (fontName.endsWith(".ttf")) {
                    fontName = fontName.replace(".ttf", "");
                }

                int resId = getContext().getResources().getIdentifier(
                        fontName.toLowerCase(),
                        "font",
                        getContext().getPackageName());
                if (resId > 0) {
                    try {
                        Typeface iconFont = ResourcesCompat.getFont(getContext(), resId);
                        view.setTypeface(iconFont);
                    } catch (Exception e) {
                        DoricLog.e("Error Font asset  " + font + " in res/font");
                    }

                } else {
                    fontName = fontPath +
                            fontName +
                            ".ttf";
                    try {
                        Typeface iconFont = Typeface.createFromAsset(getContext().getAssets(), fontName);
                        view.setTypeface(iconFont);
                    } catch (Exception e) {
                        e.printStackTrace();
                        DoricLog.e(font + " not found in Assets");
                    }

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
            case "truncateAt":
                if (prop.isNumber()) {
                    switch (prop.asNumber().toInt()) {
                        case 1:
                            view.setEllipsize(TextUtils.TruncateAt.MIDDLE);
                            break;
                        case 2:
                            view.setEllipsize(TextUtils.TruncateAt.START);
                            break;
                        case 3:
                            view.setEllipsize(null);
                            break;
                        default:
                            view.setEllipsize(TextUtils.TruncateAt.END);
                            break;
                    }
                }
                break;
            case "shadow":
                if (prop.isObject()) {
                    mView.setAlpha((prop.asObject().getProperty("opacity").asNumber().toFloat()));
                    mView.setShadowLayer(
                            prop.asObject().getProperty("radius").asNumber().toFloat(),
                            DoricUtils.dp2px(prop.asObject().getProperty("offsetX").asNumber().toFloat()),
                            DoricUtils.dp2px(prop.asObject().getProperty("offsetY").asNumber().toFloat()),
                            prop.asObject().getProperty("color").asNumber().toInt()
                    );
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    public static void setGradientTextColor(final TextView textView, final float angle, final int[] colors, final float[] positions) {
        final Rect textBound = new Rect(Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MIN_VALUE, Integer.MIN_VALUE);

        final Layout layout = textView.getLayout();
        for (int i = 0; i < textView.getLineCount(); i++) {
            float left = layout.getLineLeft(i);
            float right = layout.getLineRight(i);
            if (left < textBound.left) textBound.left = (int) left;
            if (right > textBound.right) textBound.right = (int) right;
        }
        textBound.top = layout.getLineTop(0);
        textBound.bottom = layout.getLineBottom(textView.getLineCount() - 1);
        if (textView.getIncludeFontPadding()) {
            Paint.FontMetrics fontMetrics = textView.getPaint().getFontMetrics();
            textBound.top += (fontMetrics.ascent - fontMetrics.top);
            textBound.bottom -= (fontMetrics.bottom - fontMetrics.descent);
        }

        double angleInRadians = Math.toRadians(angle);

        double r = Math.sqrt(Math.pow(textBound.bottom - textBound.top, 2) +
                Math.pow(textBound.right - textBound.left, 2)) / 2;

        float centerX = textBound.left + (textBound.right - textBound.left) / 2.f;
        float centerY = textBound.top + (textBound.bottom - textBound.top) / 2.f;

        float startX = (float) (centerX - r * Math.cos(angleInRadians));
        float startY = (float) (centerY + r * Math.sin(angleInRadians));

        float endX = (float) (centerX + r * Math.cos(angleInRadians));
        float endY = (float) (centerY - r * Math.sin(angleInRadians));

        Shader textShader = new LinearGradient(startX, startY, endX, endY, colors, positions,
                Shader.TileMode.CLAMP);

        textView.setTextColor(Color.WHITE);
        textView.getPaint().setShader(textShader);
        textView.invalidate();
    }
}
