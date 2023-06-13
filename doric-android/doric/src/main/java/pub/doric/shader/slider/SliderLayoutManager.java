package pub.doric.shader.slider;

import android.content.Context;
import android.view.View;

import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import pub.doric.utils.DoricUtils;

public class SliderLayoutManager extends LinearLayoutManager {

    private boolean enableGallery;
    private float minScale = 1f;
    private float itemWidth = 0;

    private float minAlpha = 1f;

    public SliderLayoutManager(Context context, int orientation, boolean reverseLayout) {
        super(context, orientation, reverseLayout);
    }

    @Override
    public int scrollHorizontallyBy(int dx, RecyclerView.Recycler recycler, RecyclerView.State state) {
        if (enableGallery) {
            handleHorizontalView();
        }
        return super.scrollHorizontallyBy(dx, recycler, state);
    }

    @Override
    public void onLayoutCompleted(RecyclerView.State state) {
        super.onLayoutCompleted(state);

        //scroll won't be called when first layout completed, so need to handle view at first time
        if (enableGallery) {
            handleView();
        }
    }

    public void setEnableGallery(boolean enableGallery) {
        this.enableGallery = enableGallery;
    }

    public void setItemWidth(float itemWidth) {
        this.itemWidth = itemWidth;
    }

    public void setMinScale(float minScale) {
        this.minScale = minScale;
    }

    public void setMinAlpha(float minAlpha) {
        this.minAlpha = minAlpha;
    }

    private void handleView() {
        if (getOrientation() == LinearLayoutManager.HORIZONTAL) {
            handleHorizontalView();
        }
    }

    private void handleHorizontalView() {
        float centerViewLeft = (float) (getWidth() - DoricUtils.dp2px(this.itemWidth)) / 2;//the left when the view is centered
        float moveX = DoricUtils.dp2px(this.itemWidth);//movement x from one item to another
        calculateScale(centerViewLeft, moveX);
    }

    private void calculateScale(float centerViewLeft, float moveDistance) {
        for (int i = 0; i < getChildCount(); i++) {
            View child = getChildAt(i);
            assert child != null;
            int left = child.getLeft();
            if (getOrientation() == LinearLayoutManager.VERTICAL) {
                left = child.getTop();
            }
            float factor = (left - centerViewLeft) / moveDistance;
            factor = Math.max(-1f, factor);
            factor = Math.min(1f, factor);
            if (factor > 0) {
                // right view to center
                scaleAndAlpha(child, 1f - factor * (1 - minScale), 1 - factor * (1 - minAlpha));
            } else {
                // left view to center
                scaleAndAlpha(child, 1f + factor * (1 - minScale), 1 + factor * (1 - minAlpha));
            }
        }
    }

    private void scaleAndAlpha(View view, float scale, float alpha) {
        view.setPivotX(view.getWidth() / 2f);
        view.setPivotY(view.getHeight() / 2f);
        view.setScaleX(scale);
        view.setScaleY(scale);
        view.setAlpha(alpha);
    }
}
