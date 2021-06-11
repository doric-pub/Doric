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
import android.text.Spanned;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.TextView;

import com.github.pengfeizhou.jscore.JSONBuilder;
import com.github.pengfeizhou.jscore.JSObject;
import com.github.pengfeizhou.jscore.JSValue;

import org.json.JSONObject;

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
                for (InputFilter currentFilter : currentFilters) {
                    if (!(currentFilter instanceof InputFilter.LengthFilter)) {
                        list.add(currentFilter);
                    }
                }
                if (prop.isNumber()) {
                    list.add(new InputFilter.LengthFilter(prop.asNumber().toInt()));
                }
                InputFilter[] newFilters = list.toArray(new InputFilter[0]);

                view.setFilters(newFilters);
                break;
            case "text":
                String text = prop.isString() ? prop.asString().toString() : "";
                view.setText(text);
                view.setSelection(text.length());
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
                    final int variation =
                            mView.getInputType() & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION);
                    boolean isPassword = variation
                            == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_PASSWORD)
                            || variation
                            == (EditorInfo.TYPE_CLASS_TEXT | EditorInfo.TYPE_TEXT_VARIATION_WEB_PASSWORD)
                            || variation
                            == (EditorInfo.TYPE_CLASS_NUMBER | EditorInfo.TYPE_NUMBER_VARIATION_PASSWORD);
                    int inputType;
                    switch (prop.asNumber().toInt()) {
                        case 1:
                            inputType = InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_VARIATION_NORMAL;
                            if (isPassword) {
                                inputType = inputType | InputType.TYPE_NUMBER_VARIATION_PASSWORD;
                            }
                            break;
                        case 2:
                            inputType = InputType.TYPE_CLASS_NUMBER | InputType.TYPE_NUMBER_FLAG_DECIMAL;
                            if (isPassword) {
                                inputType = inputType | InputType.TYPE_NUMBER_VARIATION_PASSWORD;
                            }
                            break;
                        case 3:
                            inputType = InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_EMAIL_ADDRESS;
                            if (isPassword) {
                                inputType = inputType | InputType.TYPE_TEXT_VARIATION_PASSWORD;
                            }
                            break;
                        case 4:
                            inputType = InputType.TYPE_CLASS_PHONE;
                            if (isPassword) {
                                inputType = inputType | InputType.TYPE_NUMBER_VARIATION_PASSWORD;
                            }
                            break;
                        default:
                            inputType = InputType.TYPE_CLASS_TEXT;
                            if (isPassword) {
                                inputType = inputType | InputType.TYPE_TEXT_VARIATION_PASSWORD;
                            }
                            break;
                    }
                    mView.setInputType(inputType);
                }
                break;
            case "password":
                if (prop.isBoolean()) {
                    final int variation =
                            mView.getInputType() & (EditorInfo.TYPE_MASK_CLASS | EditorInfo.TYPE_MASK_VARIATION);
                    if ((variation & EditorInfo.TYPE_CLASS_NUMBER) == EditorInfo.TYPE_CLASS_NUMBER) {
                        if (prop.asBoolean().value()) {
                            mView.setInputType(mView.getInputType() | InputType.TYPE_NUMBER_VARIATION_PASSWORD);
                        } else {
                            mView.setInputType(mView.getInputType() & (~InputType.TYPE_NUMBER_VARIATION_PASSWORD));
                        }
                    } else {
                        if (prop.asBoolean().value()) {
                            mView.setInputType(mView.getInputType() | InputType.TYPE_TEXT_VARIATION_PASSWORD);
                        } else {
                            mView.setInputType(mView.getInputType() & (~InputType.TYPE_TEXT_VARIATION_PASSWORD));
                        }
                    }

                }
                break;
            case "editable":
                if (prop.isBoolean()) {
                    view.setEnabled(prop.asBoolean().value());
                }
                break;
            case "returnKeyType":
                if (prop.isNumber()) {
                    int returnKeyType = prop.asNumber().toInt();
                    switch (returnKeyType) {
                        case 1:
                            view.setImeOptions(EditorInfo.IME_ACTION_DONE);
                            break;
                        case 2:
                            view.setImeOptions(EditorInfo.IME_ACTION_SEARCH);
                            break;
                        case 3:
                            view.setImeOptions(EditorInfo.IME_ACTION_NEXT);
                            break;
                        case 4:
                            view.setImeOptions(EditorInfo.IME_ACTION_GO);
                            break;
                        case 5:
                            view.setImeOptions(EditorInfo.IME_ACTION_SEND);
                            break;
                        case 0:
                        default:
                            view.setImeOptions(EditorInfo.IME_ACTION_UNSPECIFIED);
                            break;
                    }
                }
                break;
            case "onSubmitEditing":
                if (!prop.isString()) {
                    return;
                }
                final String functionId = prop.asString().value();
                view.setOnEditorActionListener(new TextView.OnEditorActionListener() {
                    @Override
                    public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
                        switch (actionId) {
                            case EditorInfo.IME_ACTION_UNSPECIFIED:
                            case EditorInfo.IME_ACTION_NEXT:
                            case EditorInfo.IME_ACTION_DONE:
                            case EditorInfo.IME_ACTION_GO:
                            case EditorInfo.IME_ACTION_SEARCH:
                            case EditorInfo.IME_ACTION_SEND:
                                callJSResponse(functionId, v.getText().toString());
                                return true;
                        }
                        return false;
                    }
                });
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
    public JSONObject getSelection() {
        return new JSONBuilder()
                .put("start", mView.getSelectionStart())
                .put("end", mView.getSelectionEnd())
                .toJSONObject();
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
