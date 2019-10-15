package com.github.penfeizhou.doric.shader;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.RectF;
import android.graphics.Region;
import android.os.Build;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import android.util.AttributeSet;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;

/**
 * @Description: com.github.penfeizhou.doric.shader
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-31
 */
public class DoricLayer extends FrameLayout {
    private Path mCornerPath = new Path();
    private Paint mShadowPaint;
    private Paint mBorderPaint;
    private RectF mRect = new RectF();
    private float[] mCornerRadii;

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
        mRect.left = 0;
        mRect.right = getWidth();
        mRect.top = 0;
        mRect.bottom = getHeight();
        canvas.save();
        if (mCornerRadii != null) {
            mCornerPath.reset();
            mCornerPath.addRoundRect(mRect, mCornerRadii, Path.Direction.CW);
            canvas.clipPath(mCornerPath);
        }

        super.dispatchDraw(canvas);
        canvas.restore();
        // draw border
        if (mBorderPaint != null) {
            ((ViewGroup) getParent()).setClipChildren(false);
            if (mCornerRadii != null) {
                canvas.drawRoundRect(mRect, mCornerRadii[0], mCornerRadii[1], mBorderPaint);
            } else {
                canvas.drawRect(mRect, mBorderPaint);
            }
        }
        if (mShadowPaint != null) {
            ((ViewGroup) getParent()).setClipChildren(false);
            canvas.save();
            if (mCornerRadii != null) {
                canvas.clipPath(mCornerPath, Region.Op.DIFFERENCE);
                canvas.drawRoundRect(mRect, mCornerRadii[0], mCornerRadii[1], mShadowPaint);
            } else {
                canvas.clipRect(mRect, Region.Op.DIFFERENCE);
                canvas.drawRect(mRect, mShadowPaint);
            }
            canvas.restore();
        }
    }

    public void setShadow(int sdColor, int sdOpacity, int sdRadius, int offsetX, int offsetY) {
        if (mShadowPaint == null) {
            mShadowPaint = new Paint();
            mShadowPaint.setAntiAlias(true);
            mShadowPaint.setStyle(Paint.Style.FILL);
        }
        mShadowPaint.setColor(sdColor);
        mShadowPaint.setAlpha(sdOpacity);
        mShadowPaint.setShadowLayer(sdRadius, offsetX, offsetY, sdColor);
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
        setCornerRadius(corner, corner, corner, corner);
    }

    public void setCornerRadius(int leftTop, int rightTop, int rightBottom, int leftBottom) {
        mCornerRadii = new float[]{
                leftTop, leftTop,
                rightTop, rightTop,
                rightBottom, rightBottom,
                leftBottom, leftBottom,
        };
    }

}
