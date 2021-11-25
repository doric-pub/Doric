/*
 * Copyright [2021] [Doric.Pub]
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
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.Rect;

import androidx.annotation.NonNull;
import pub.doric.utils.DoricUtils;

/**
 * @Description: This could blur what's contained.
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/24
 */
public class BlurEffectView extends DoricLayer {
    private Rect mEffectiveRect = null;

    private int mRadius = 15;

    private Bitmap mFullBitmap = null;
    private Canvas mFullCanvas = null;
    private Bitmap mRectBitmap = null;
    private Canvas mRectCanvas = null;
    private Rect mDstRect = null;

    public BlurEffectView(@NonNull Context context) {
        super(context);
    }

    public void setEffectiveRect(Rect rect) {
        this.mEffectiveRect = rect;
        this.mDstRect = new Rect(0, 0, rect.width(), rect.height());
        invalidate();
    }

    public void setRadius(int radius) {
        if (radius <= 0) {
            return;
        }
        this.mRadius = radius;
        invalidate();
    }

    @Override
    protected void dispatchDraw(Canvas canvas) {
        if (mFullBitmap == null
                || mFullBitmap.getWidth() != canvas.getWidth()
                || mFullBitmap.getHeight() != canvas.getHeight()) {
            mFullBitmap = Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.ARGB_8888);
            mFullCanvas = new Canvas(mFullBitmap);
        }
        mFullCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        super.dispatchDraw(mFullCanvas);
        Bitmap blurringBitmap;
        if (mEffectiveRect != null) {
            if (mRectBitmap == null
                    || mRectBitmap.getWidth() != mEffectiveRect.width()
                    || mRectBitmap.getHeight() != mEffectiveRect.height()) {
                mRectBitmap = Bitmap.createBitmap(mEffectiveRect.width(), mEffectiveRect.height(), Bitmap.Config.ARGB_8888);
                mRectCanvas = new Canvas(mRectBitmap);
            }
            blurringBitmap = mRectBitmap;
            mRectCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
            mRectCanvas.drawBitmap(mFullBitmap, mEffectiveRect, mDstRect, null);
        } else {
            blurringBitmap = mFullBitmap;
        }
        Bitmap blurredBitmap = DoricUtils.blur(getContext(), blurringBitmap, mRadius);
        Bitmap retBitmap;
        if (mEffectiveRect != null) {
            mFullCanvas.drawBitmap(blurredBitmap, mDstRect, mEffectiveRect, null);
            retBitmap = mFullBitmap;
        } else {
            retBitmap = blurredBitmap;
        }

        canvas.drawBitmap(retBitmap, 0, 0, null);
    }
}
