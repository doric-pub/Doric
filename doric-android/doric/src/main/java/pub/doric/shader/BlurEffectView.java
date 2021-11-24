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
import android.os.Build;

import androidx.annotation.NonNull;
import jp.wasabeef.glide.transformations.internal.FastBlur;
import jp.wasabeef.glide.transformations.internal.RSBlur;
import jp.wasabeef.glide.transformations.internal.SupportRSBlur;

/**
 * @Description: This could blur what's contained.
 * @Author: pengfei.zhou
 * @CreateDate: 2021/11/24
 */
public class BlurEffectView extends DoricLayer {
    private Rect effectiveRect = null;

    private int mRadius = 15;

    private Bitmap mBitmap = null;
    private Canvas mBlurCanvas = null;

    public BlurEffectView(@NonNull Context context) {
        super(context);
    }

    public void setEffectiveRect(Rect rect) {
        this.effectiveRect = rect;
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
        if (mBitmap == null
                || mBitmap.getWidth() != canvas.getWidth()
                || mBitmap.getHeight() != canvas.getHeight()) {
            mBitmap = Bitmap.createBitmap(canvas.getWidth(), canvas.getHeight(), Bitmap.Config.ARGB_8888);
            mBlurCanvas = new Canvas(mBitmap);
        }
        mBlurCanvas.drawColor(Color.TRANSPARENT, PorterDuff.Mode.CLEAR);
        super.dispatchDraw(mBlurCanvas);
        Bitmap bitmap;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.JELLY_BEAN_MR2
                && mRadius <= 25) {
            try {
                bitmap = SupportRSBlur.blur(getContext(), mBitmap, mRadius);
            } catch (NoClassDefFoundError e) {
                try {
                    bitmap = RSBlur.blur(getContext(), mBitmap, mRadius);
                } catch (Exception ee) {
                    bitmap = FastBlur.blur(mBitmap, mRadius, true);
                }
            } catch (Exception e) {
                bitmap = FastBlur.blur(mBitmap, mRadius, true);
            }
        } else {
            bitmap = FastBlur.blur(mBitmap, mRadius, true);
        }
        canvas.drawBitmap(bitmap, 0, 0, null);
    }
}
