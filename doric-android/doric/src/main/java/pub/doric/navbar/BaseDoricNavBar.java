package pub.doric.navbar;

import android.app.Activity;
import android.content.Context;
import android.support.annotation.AttrRes;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.text.Layout;
import android.text.StaticLayout;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import pub.doric.R;

/**
 * @Description: pub.doric.navbar
 * @Author: pengfei.zhou
 * @CreateDate: 2019-11-25
 */
public class BaseDoricNavBar extends FrameLayout implements IDoricNavBar {
    private ViewGroup mTitleContainer;
    private ViewGroup mRightContainer;
    private ViewGroup mLeftContainer;
    private TextView mTvTitle;

    public BaseDoricNavBar(@NonNull Context context) {
        this(context, null);
    }

    public BaseDoricNavBar(@NonNull Context context, @Nullable AttributeSet attrs) {
        this(context, attrs, 0);
    }

    public BaseDoricNavBar(@NonNull Context context, @Nullable AttributeSet attrs, @AttrRes int defStyleAttr) {
        super(context, attrs, defStyleAttr);
        setup();
    }

    private void setup() {
        LayoutInflater.from(getContext()).inflate(R.layout.doric_navigator, this);
        mTitleContainer = findViewById(R.id.container_title);
        mLeftContainer = findViewById(R.id.container_left);
        mRightContainer = findViewById(R.id.container_right);
        mTvTitle = findViewById(R.id.tv_title);
        findViewById(R.id.tv_back).setOnClickListener(new OnClickListener() {
            @Override
            public void onClick(View v) {
                if (getContext() instanceof Activity) {
                    ((Activity) getContext()).onBackPressed();
                }
            }
        });
    }

    @Override
    public boolean isHidden() {
        return getVisibility() != VISIBLE;
    }

    @Override
    public void setHidden(boolean b) {
        setVisibility(b ? GONE : VISIBLE);
    }

    @Override
    public void setTitle(String title) {
        mTvTitle.setText(title);
    }

    private void updateTitleMargins() {
        try {
            int width = mRightContainer.getRight() - mLeftContainer.getLeft();
            int leftWidth = mLeftContainer.getWidth();
            int rightWidth = mRightContainer.getWidth();
            int margin = Math.max(leftWidth, rightWidth);
            if (leftWidth + rightWidth > width) {
                mTitleContainer.setVisibility(GONE);
            } else {
                mTitleContainer.setVisibility(VISIBLE);
                StaticLayout staticLayout = new StaticLayout(mTvTitle.getText(),
                        mTvTitle.getPaint(), Integer.MAX_VALUE, Layout.Alignment.ALIGN_NORMAL,
                        1.0f, 0.0f, false);
                float textWidth = (staticLayout.getLineCount() > 0 ? staticLayout.getLineWidth(0) : 0.0f);
                if (width - 2 * margin >= textWidth) {
                    mTitleContainer.setPadding(margin, 0, margin, 0);
                } else {
                    mTitleContainer.setPadding(leftWidth, 0, rightWidth, 0);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void onLayout(boolean changed, int left, int top, int right, int bottom) {
        super.onLayout(changed, left, top, right, bottom);
        updateTitleMargins();
    }
}