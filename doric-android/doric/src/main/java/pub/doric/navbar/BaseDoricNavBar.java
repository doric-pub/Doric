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
package pub.doric.navbar;

import android.app.Activity;
import android.content.Context;
import android.text.Layout;
import android.text.StaticLayout;
import android.util.AttributeSet;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;

import androidx.annotation.AttrRes;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

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

    public void setBackIconVisible(boolean visible) {
        findViewById(R.id.tv_back).setVisibility(visible ? View.VISIBLE : View.GONE);
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

    @Override
    public void setLeft(View view) {
        mLeftContainer.removeAllViews();
        mLeftContainer.addView(view);
    }

    @Override
    public void setRight(View view) {
        mRightContainer.removeAllViews();
        mRightContainer.addView(view);
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