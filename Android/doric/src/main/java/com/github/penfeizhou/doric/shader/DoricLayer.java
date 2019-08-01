package com.github.penfeizhou.doric.shader;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Path;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.view.View;
import android.widget.FrameLayout;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-31
 */
public class DoricLayer extends FrameLayout {
    private int mCornerRadius;

    private Path mCornerPath = new Path();
    private Paint shadowPaint = new Paint();
    private Paint mBorderPaint;

    public DoricLayer(@NonNull Context context) {
        super(context);
    }

    public DoricLayer(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public DoricLayer(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public DoricLayer(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
    }

    @Override
    public void draw(Canvas canvas) {
        super.draw(canvas);
    }

    @Override
    protected boolean drawChild(Canvas canvas, View child, long drawingTime) {
        return super.drawChild(canvas, child, drawingTime);
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        super.dispatchDraw(canvas);
        // draw border
        if (mBorderPaint != null) {
            canvas.drawRect(0, 0, getWidth(), getHeight(), mBorderPaint);
        }
    }

    public void setBorder(int borderWidth, int borderColor) {
        if (borderWidth == 0) {
            mBorderPaint = null;
        }
        if (mBorderPaint == null) {
            mBorderPaint = new Paint();
            mBorderPaint.setAntiAlias(true);
            mBorderPaint.setStyle(Paint.Style.STROKE);
        }
        mBorderPaint.setStrokeWidth(borderWidth);
        mBorderPaint.setColor(borderColor);
    }

    public void setCornerRadius(int corner) {
        if (mCornerRadius != corner) {
            this.mCornerRadius = corner;
            mCornerPath.reset();
        }
    }

}
