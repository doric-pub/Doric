package pub.doric.pullable;

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
public class DoricRefreshView extends FrameLayout implements IPullable {
    private View content;
    private Animation.AnimationListener mListener;

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
        if (v.getLayoutParams() instanceof FrameLayout.LayoutParams) {
            ((LayoutParams) v.getLayoutParams()).gravity = Gravity.BOTTOM;
        } else {
            LayoutParams params = new LayoutParams(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT);
            params.gravity = Gravity.CENTER;
            v.setLayoutParams(params);
        }
        addView(v);
    }

    public View getContent() {
        return content;
    }

    @Override
    public void startAnimation() {
        if (content != null && content instanceof IPullable) {
            ((IPullable) content).startAnimation();
        }
    }

    @Override
    public void stopAnimation() {
        if (content != null && content instanceof IPullable) {
            ((IPullable) content).stopAnimation();
        }
    }

    @Override
    public int successAnimation() {
        if (content != null && content instanceof IPullable) {
            return ((IPullable) content).successAnimation();
        } else {
            return 0;
        }
    }

    @Override
    public void setProgressRotation(float rotation) {
        if (content != null && content instanceof IPullable) {
            ((IPullable) content).setProgressRotation(rotation);
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