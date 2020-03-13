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

import android.arch.lifecycle.Lifecycle;
import android.arch.lifecycle.LifecycleObserver;
import android.arch.lifecycle.LifecycleOwner;
import android.arch.lifecycle.OnLifecycleEvent;
import android.content.Context;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.util.AttributeSet;
import android.widget.FrameLayout;

import com.github.penfeizhou.animation.decode.Frame;

import pub.doric.utils.DoricUtils;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricPanel extends FrameLayout implements LifecycleObserver {

    private DoricContext mDoricContext;
    private FrameChangedListener frameChangedListener;
    private int renderedWidth = -1;
    private int renderedHeight = -1;

    public DoricPanel(@NonNull Context context) {
        this(context, null);
    }

    public DoricPanel(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public DoricPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        if (getContext() instanceof LifecycleOwner) {
            ((LifecycleOwner) getContext()).getLifecycle().addObserver(this);
        }
    }


    public void config(String script, String alias, String extra) {
        DoricContext doricContext = DoricContext.create(getContext(), script, alias, extra);
        doricContext.onShow();
        config(doricContext);
    }

    public void config(DoricContext doricContext) {
        mDoricContext = doricContext;
        mDoricContext.getRootNode().setRootView(this);
        if (getMeasuredWidth() != 0 && getMeasuredHeight() != 0) {
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
        if (mDoricContext != null) {
            if (w != renderedWidth || h != renderedHeight) {
                if (renderedWidth == oldw && renderedHeight == oldh) {
                    //Changed by doric
                    if (frameChangedListener != null) {
                        frameChangedListener.onFrameChanged(w, h);
                    }
                    renderedWidth = w;
                    renderedHeight = h;
                } else {
                    mDoricContext.init(DoricUtils.px2dp(w), DoricUtils.px2dp(h));
                    renderedWidth = w;
                    renderedHeight = h;
                }
            }
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    public void onActivityResume() {
        if (mDoricContext != null) {
            mDoricContext.onShow();
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    public void onActivityPause() {
        if (mDoricContext != null) {
            mDoricContext.onHidden();
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    public void onActivityDestroy() {
        if (mDoricContext != null) {
            mDoricContext.teardown();
        }
    }

    public interface FrameChangedListener {
        void onFrameChanged(int width, int height);
    }

    public void setFrameChangedListener(FrameChangedListener listener) {
        this.frameChangedListener = listener;
    }
}
