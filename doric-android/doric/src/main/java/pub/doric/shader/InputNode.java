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

import android.content.Context;
import android.text.Editable;
import android.text.InputFilter;
import android.text.InputType;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;

import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.LinkedList;

import pub.doric.DoricContext;
import pub.doric.extension.bridge.DoricMethod;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.extension.bridge.DoricPromise;

/**
 * @Description: pub.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-12-06
 */
@DoricPlugin(name = "Input")
public class InputNode extends ViewNode<EditText> implements TextWatcher, View.OnFocusChangeListener {
    private final InputMethodManager mInputMethodManager;
    private String onTextChangeId;
    private String onFocusChangeId;

    public InputNode(DoricContext doricContext) {
        super(doricContext);
        mInputMethodManager = (InputMethodManager) getContext().getSystemService(Context.INPUT_METHOD_SERVICE);
    }

    @Override
    protected EditText build() {
        EditText editText = new EditText(getContext());
        editText.addTextChangedListener(this);
        editText.setOnFocusChangeListener(this);
        editText.setBackground(null);
        editText.setGravity(Gravity.START | Gravity.TOP);
        return editText;
    }

    @Override
    protected void blend(EditText view, String name, JSValue prop) {
        switch (name) {
            case "maxLength":
                InputFilter[] currentFilters = view.getFilters();

                LinkedList<InputFilter> list = new LinkedList<>();
                for (int i = 0; i < currentFilters.length; i++) {
                    if (!(currentFilters[i] instanceof InputFilter.LengthFilter)) {
                        list.add(currentFilters[i]);
                    }
                }
                if (prop.isNumber()) {
                    list.add(new InputFilter.LengthFilter(prop.asNumber().toInt()));
                }
                InputFilter[] newFilters = list.toArray(new InputFilter[list.size()]);

                view.setFilters(newFilters);
                break;
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
                view.setGravity(prop.asNumber().toInt());
                break;
            case "hintText":
                view.setHint(prop.asString().toString());
                break;
            case "hintTextColor":
                view.setHintTextColor(prop.asNumber().toInt());
                break;
            case "multiline":
                if (prop.asBoolean().value()) {
                    view.setInputType(view.getInputType() | InputType.TYPE_TEXT_FLAG_MULTI_LINE);
                } else {
                    view.setInputType(view.getInputType() & ~InputType.TYPE_TEXT_FLAG_MULTI_LINE);
                }
                break;
            case "onTextChange":
                if (prop.isString()) {
                    onTextChangeId = prop.asString().value();
                } else {
                    onTextChangeId = null;
                }
                break;
            case "onFocusChange":
                if (prop.isString()) {
                    onFocusChangeId = prop.asString().value();
                } else {
                    onFocusChangeId = null;
                }
                break;
            case "inputType":
                if (prop.isNumber()) {
                    switch (prop.asNumber().toInt()) {
                        case 1:
                            mView.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_NORMAL);
                            break;
                        case 2:
                            mView.setInputType(InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL);
                            break;
                        case 3:
                            mView.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS);
                            break;
                        case 4:
                            mView.setInputType(InputType.TYPE_CLASS_PHONE);
                            break;
                        default:
                            mView.setInputType(InputType.TYPE_CLASS_TEXT);
                            break;
                    }
                }
                break;
            default:
                super.blend(view, name, prop);
                break;
        }
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {

    }

    @Override
    public void afterTextChanged(Editable s) {
        if (!TextUtils.isEmpty(onTextChangeId)) {
            callJSResponse(onTextChangeId, s.toString());
        }
    }

    @Override
    public void onFocusChange(View v, boolean hasFocus) {
        if (!TextUtils.isEmpty(onFocusChangeId)) {
            callJSResponse(onFocusChangeId, hasFocus);
        }
    }

    @DoricMethod
    public String getText() {
        return mView.getText().toString();
    }

    @DoricMethod
    public void setSelection(JSObject jsObject, DoricPromise doricPromise) {
        int start = jsObject.getProperty("start").asNumber().toInt();
        int end = jsObject.getProperty("end").asNumber().toInt();
        mView.setSelection(start, end);
        doricPromise.resolve();
    }

    @DoricMethod
    public void requestFocus(DoricPromise promise) {
        mView.requestFocus();
        promise.resolve();
    }

    @DoricMethod
    public void releaseFocus(DoricPromise promise) {
        mView.clearFocus();
        mInputMethodManager.hideSoftInputFromWindow(mView.getWindowToken(), 0);
        promise.resolve();
    }
}
