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

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.GestureDetector;
import android.view.MotionEvent;
import android.view.ScaleGestureDetector;
import android.widget.FrameLayout;

import com.github.pengfeizhou.jscore.JSDecoder;
import com.github.pengfeizhou.jscore.JSValue;

import java.util.concurrent.Callable;

import pub.doric.DoricContext;
import pub.doric.async.AsyncResult;
import pub.doric.extension.bridge.DoricPlugin;
import pub.doric.utils.DoricJSDispatcher;
import pub.doric.utils.DoricUtils;

/**
 * @Description: pub.doric.shader
 * @Author: jingpeng.wang
 * @CreateDate: 2021-09-16
 */

@DoricPlugin(name = "GestureContainer")
public class GestureContainerNode extends StackNode {

    private DoricJSDispatcher jsDispatcher = new DoricJSDispatcher();

    private enum SwipeOrientation {
        LEFT(0), RIGHT(1), TOP(2), BOTTOM(3);

        private final int value;

        SwipeOrientation(int value) {
            this.value = value;
        }

        public int getValue() {
            return value;
        }
    }

    private String onTouchDown;
    private String onTouchMove;
    private String onTouchUp;
    private String onTouchCancel;

    private String onSingleTap;
    private String onDoubleTap;
    private String onLongPress;
    private String onPinch;
    private String onPan;
    private String onRotate;
    private String onSwipe;

    public GestureContainerNode(DoricContext doricContext) {
        super(doricContext);
    }

    @Override
    protected FrameLayout build() {
        return new GestureContainerView(getContext());
    }

    @Override
    protected void blend(FrameLayout view, String name, JSValue prop) {
        if ("onSingleTap".equals(name)) {
            if (prop.isString()) {
                onSingleTap = prop.asString().value();
            } else {
                onSingleTap = null;
            }
        } else if ("onDoubleTap".equals(name)) {
            if (prop.isString()) {
                onDoubleTap = prop.asString().value();
            } else {
                onDoubleTap = null;
            }
        } else if ("onLongPress".equals(name)) {
            if (prop.isString()) {
                onLongPress = prop.asString().value();
            } else {
                onLongPress = null;
            }
        } else if ("onPinch".equals(name)) {
            if (prop.isString()) {
                onPinch = prop.asString().value();
            } else {
                onPinch = null;
            }
        } else if ("onPan".equals(name)) {
            if (prop.isString()) {
                onPan = prop.asString().value();
            } else {
                onPan = null;
            }
        } else if ("onRotate".equals(name)) {
            if (prop.isString()) {
                onRotate = prop.asString().value();
            } else {
                onRotate = null;
            }
        } else if ("onSwipe".equals(name)) {
            if (prop.isString()) {
                onSwipe = prop.asString().value();
            } else {
                onSwipe = null;
            }
        } else if ("onTouchDown".equals(name)) {
            if (prop.isString()) {
                onTouchDown = prop.asString().value();
            } else {
                onTouchDown = null;
            }
        } else if ("onTouchMove".equals(name)) {
            if (prop.isString()) {
                onTouchMove = prop.asString().value();
            } else {
                onTouchMove = null;
            }
        } else if ("onTouchUp".equals(name)) {
            if (prop.isString()) {
                onTouchUp = prop.asString().value();
            } else {
                onTouchUp = null;
            }
        } else if ("onTouchCancel".equals(name)) {
            if (prop.isString()) {
                onTouchCancel = prop.asString().value();
            } else {
                onTouchCancel = null;
            }
        } else {
            super.blend(view, name, prop);
        }
    }

    private class GestureContainerView extends FrameLayout {
        private final GestureDetector gestureDetector;
        private final ScaleGestureDetector scaleGestureDetector;
        private final RotateGestureDetector rotateGestureDetector;

        public GestureContainerView(Context context) {
            super(context);

            gestureDetector = new GestureDetector(context, new GestureDetector.SimpleOnGestureListener() {

                private static final int SWIPE_THRESHOLD = 100;
                private static final int SWIPE_VELOCITY_THRESHOLD = 100;

                @Override
                public boolean onSingleTapConfirmed(MotionEvent e) {
                    if (onSingleTap != null)
                        callJSResponse(onSingleTap);
                    return super.onSingleTapConfirmed(e);
                }

                @Override
                public boolean onDoubleTap(MotionEvent e) {
                    if (onDoubleTap != null)
                        callJSResponse(onDoubleTap);
                    return super.onDoubleTap(e);
                }

                @Override
                public void onLongPress(MotionEvent e) {
                    super.onLongPress(e);
                    if (onLongPress != null)
                        callJSResponse(onLongPress);
                }

                @Override
                public boolean onScroll(MotionEvent e1, MotionEvent e2, final float distanceX, final float distanceY) {
                    if (scaleGestureDetector.isInProgress()) {
                        // don't allow scrolling while scaling
                        return false;
                    }

                    // handle scrolling
                    if (onPan != null)
                        jsDispatcher.dispatch(new Callable<AsyncResult<JSDecoder>>() {
                            @Override
                            public AsyncResult<JSDecoder> call() throws Exception {
                                return callJSResponse(onPan, DoricUtils.px2dp(distanceX), DoricUtils.px2dp(distanceY));
                            }
                        });

                    return true;
                }

                @Override
                public boolean onFling(MotionEvent e1, MotionEvent e2, float velocityX, float velocityY) {
                    boolean result = false;
                    try {
                        float diffY = e2.getY() - e1.getY();
                        float diffX = e2.getX() - e1.getX();
                        if (Math.abs(diffX) > Math.abs(diffY)) {
                            if (Math.abs(diffX) > SWIPE_THRESHOLD && Math.abs(velocityX) > SWIPE_VELOCITY_THRESHOLD) {
                                if (diffX > 0) {
                                    onSwipeRight();
                                } else {
                                    onSwipeLeft();
                                }
                                result = true;
                            }
                        } else if (Math.abs(diffY) > SWIPE_THRESHOLD && Math.abs(velocityY) > SWIPE_VELOCITY_THRESHOLD) {
                            if (diffY > 0) {
                                onSwipeBottom();
                            } else {
                                onSwipeTop();
                            }
                            result = true;
                        }
                    } catch (Exception exception) {
                        exception.printStackTrace();
                    }
                    return result;
                }
            });

            scaleGestureDetector = new ScaleGestureDetector(context, new ScaleGestureDetector.OnScaleGestureListener() {
                @Override
                public boolean onScale(final ScaleGestureDetector scaleGestureDetector) {
                    if (onPinch != null)
                        jsDispatcher.dispatch(new Callable<AsyncResult<JSDecoder>>() {
                            @Override
                            public AsyncResult<JSDecoder> call() throws Exception {
                                return callJSResponse(onPinch, scaleGestureDetector.getScaleFactor());
                            }
                        });

                    return false;
                }

                @Override
                public boolean onScaleBegin(ScaleGestureDetector scaleGestureDetector) {
                    return true;
                }

                @Override
                public void onScaleEnd(ScaleGestureDetector scaleGestureDetector) {

                }
            });

            rotateGestureDetector = new RotateGestureDetector(context, new RotateGestureDetector.OnRotateGestureListener() {

                @Override
                public boolean onRotate(final float degrees, float focusX, float focusY) {
                    if (onRotate != null)
                        jsDispatcher.dispatch(new Callable<AsyncResult<JSDecoder>>() {
                            @Override
                            public AsyncResult<JSDecoder> call() throws Exception {
                                return callJSResponse(onRotate, degrees / 180f);
                            }
                        });

                    return false;
                }
            });
        }

        @SuppressLint("ClickableViewAccessibility")
        @Override
        public boolean onTouchEvent(MotionEvent event) {
            // handle touch event conflict when in a scroll view or other similar containers

            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    if (onTouchDown != null)
                        callJSResponse(onTouchDown, DoricUtils.px2dp(event.getX()), DoricUtils.px2dp(event.getY()));
                    break;
                case MotionEvent.ACTION_MOVE:
                    getParent().requestDisallowInterceptTouchEvent(true);

                    final float x = DoricUtils.px2dp(event.getX());
                    final float y = DoricUtils.px2dp(event.getY());

                    if (onTouchMove != null)
                        jsDispatcher.dispatch(new Callable<AsyncResult<JSDecoder>>() {
                            @Override
                            public AsyncResult<JSDecoder> call() throws Exception {
                                return callJSResponse(onTouchMove, x, y);
                            }
                        });
                    break;
                case MotionEvent.ACTION_UP:
                    if (onTouchUp != null)
                        callJSResponse(onTouchUp, DoricUtils.px2dp(event.getX()), DoricUtils.px2dp(event.getY()));
                case MotionEvent.ACTION_CANCEL:
                    getParent().requestDisallowInterceptTouchEvent(false);

                    if (onTouchCancel != null)
                        callJSResponse(onTouchCancel, DoricUtils.px2dp(event.getX()), DoricUtils.px2dp(event.getY()));
                    break;
            }

            // handle gesture
            boolean scaleRet = scaleGestureDetector.onTouchEvent(event);
            boolean rotateRet = rotateGestureDetector.onTouchEvent(event);
            boolean commonRet = gestureDetector.onTouchEvent(event);
            return (scaleRet || rotateRet || commonRet) || super.onTouchEvent(event);
        }

        private void onSwipeLeft() {
            if (onSwipe != null)
                callJSResponse(onSwipe, SwipeOrientation.LEFT.value);
        }

        private void onSwipeRight() {
            if (onSwipe != null)
                callJSResponse(onSwipe, SwipeOrientation.RIGHT.value);
        }

        private void onSwipeTop() {
            if (onSwipe != null)
                callJSResponse(onSwipe, SwipeOrientation.TOP.value);
        }

        private void onSwipeBottom() {
            if (onSwipe != null)
                callJSResponse(onSwipe, SwipeOrientation.BOTTOM.value);
        }
    }
}
