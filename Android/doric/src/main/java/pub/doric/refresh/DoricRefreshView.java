package pub.doric.refresh;

import android.content.Context;
import android.util.AttributeSet;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.widget.FrameLayout;

import androidx.annotation.AttrRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

/**
 * @Description: pub.doric.pullable
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
public class DoricRefreshView extends FrameLayout implements PullingListener {
    private View content;
    private Animation.AnimationListener mListener;

    private PullingListener mPullingListener;

    public DoricRefreshView(@NonNull Context context) {
        super(context);
    }

    public DoricRefreshView(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public DoricRefreshView(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setContent(View v) {
        removeAllViews();
        content = v;
        ViewGroup.LayoutParams params = v.getLayoutParams();
        if (params instanceof LayoutParams) {
            ((LayoutParams) params).gravity = Gravity.BOTTOM;
        } else {
            LayoutParams layoutParams = new LayoutParams(
                    params == null ? ViewGroup.LayoutParams.WRAP_CONTENT : params.width,
                    params == null ? ViewGroup.LayoutParams.WRAP_CONTENT : params.height);
            layoutParams.gravity = Gravity.CENTER;
            v.setLayoutParams(layoutParams);
        }
        addView(v);
    }

    public View getContent() {
        return content;
    }


    public void setPullingListener(PullingListener listener) {
        this.mPullingListener = listener;
    }

    @Override
    public void startAnimation() {
        if (mPullingListener != null) {
            mPullingListener.startAnimation();
        }
    }

    @Override
    public void stopAnimation() {
        if (mPullingListener != null) {
            mPullingListener.stopAnimation();
        }
    }

    @Override
    public void setPullingDistance(float distance) {
        if (mPullingListener != null) {
            mPullingListener.setPullingDistance(distance);
        }
    }

    public void setAnimationListener(Animation.AnimationListener listener) {
        mListener = listener;
    }

    @Override
    protected void onAnimationStart() {
        super.onAnimationStart();
        if (mListener != null) {
            mListener.onAnimationStart(getAnimation());
        }
    }

    @Override
    protected void onAnimationEnd() {
        super.onAnimationEnd();
        if (mListener != null) {
            mListener.onAnimationEnd(getAnimation());
        }
    }
}