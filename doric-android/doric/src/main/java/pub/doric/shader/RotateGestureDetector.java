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
import android.view.MotionEvent;

/**
 * @Description: pub.doric.shader
 * @Author: jingpeng.wang
 * @CreateDate: 2021-09-16
 */

public class RotateGestureDetector {
    public interface OnRotateGestureListener {
        boolean onRotate(float degrees, float focusX, float focusY);
    }

    public static class SimpleOnRotateGestureDetector implements OnRotateGestureListener {
        @Override
        public boolean onRotate(float degrees, float focusX, float focusY) {
            return false;
        }
    }

    private static float RADIAN_TO_DEGREES = (float) (180.0 / Math.PI);
    private OnRotateGestureListener listener;
    private float prevX = 0.0f;
    private float prevY = 0.0f;
    private float prevTan;

    public RotateGestureDetector(Context context, OnRotateGestureListener listener) {
        this.listener = listener;
    }

    public boolean onTouchEvent(MotionEvent event) {
        if (event.getPointerCount() == 2 && event.getActionMasked() == MotionEvent.ACTION_MOVE) {
            boolean result = true;
            float x = event.getX(1) - event.getX(0);
            float y = event.getY(1) - event.getY(0);
            float focusX = (event.getX(1) + event.getX(0)) * 0.5f;
            float focusY = (event.getY(1) + event.getY(0)) * 0.5f;
            float tan = (float) Math.atan2(y, x);

            if (prevX != 0.0f && prevY != 0.0f) {
                result = listener.onRotate((tan - prevTan) * RADIAN_TO_DEGREES, focusX, focusY);
            }

            prevX = x;
            prevY = y;
            prevTan = tan;
            return result;
        } else {
            prevX = prevY = prevTan = 0.0f;
            return true;
        }
    }
}
