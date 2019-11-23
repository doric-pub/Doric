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
package pub.doric;

import android.content.Context;
import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import android.util.AttributeSet;
import android.widget.FrameLayout;

import pub.doric.utils.DoricUtils;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricPanel extends FrameLayout {

    private DoricContext mDoricContext;

    public DoricPanel(@NonNull Context context) {
        super(context);
    }

    public DoricPanel(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public DoricPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public DoricPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    public void config(String script, String alias) {
        DoricContext doricContext = DoricContext.create(getContext(), script, alias);
        config(doricContext);
    }

    public void config(DoricContext doricContext) {
        mDoricContext = doricContext;
        mDoricContext.getRootNode().setRootView(this);
        if (getMeasuredState() != 0) {
            mDoricContext.init(DoricUtils.px2dp(getMeasuredWidth()), DoricUtils.px2dp(getMeasuredHeight()));
        }
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
    }

    public DoricContext getDoricContext() {
        return mDoricContext;
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        if (oldw != w || oldh != h) {
            if (mDoricContext != null) {
                mDoricContext.init(DoricUtils.px2dp(w), DoricUtils.px2dp(h));
            }
        }
    }
}
