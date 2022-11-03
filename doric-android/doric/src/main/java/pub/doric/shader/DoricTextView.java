package pub.doric.shader;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Rect;
import android.graphics.Shader;
import android.text.Layout;
import android.util.AttributeSet;
import android.widget.TextView;

import androidx.annotation.Nullable;

@SuppressLint("AppCompatCustomView")
public class DoricTextView extends TextView {

    private boolean strikethrough = false;
    private boolean underline = false;

    private float shadowAlpha = 0;
    private float shadowRadius = 0;
    private float shadowDx = 0;
    private float shadowDy = 0;
    private int shadowColor = Color.TRANSPARENT;

    private float gradientAngle = 0;
    private int[] gradientColors = null;
    private float[] gradientPositions = null;

    public DoricTextView(Context context) {
        super(context);
    }

    public DoricTextView(Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public DoricTextView(Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    public void setShadow(float alpha, float radius, float dx, float dy, int color) {
        this.shadowAlpha = alpha;
        this.shadowRadius = radius;
        this.shadowDx = dx;
        this.shadowDy = dy;
        this.shadowColor = color;

        getPaint().setAlpha((int) (255 * alpha));
        getPaint().setShadowLayer(radius, dx, dy, color);
    }

    public boolean hasShadow() {
        return this.shadowAlpha > 0;
    }

    public void setGradient(float angle, int[] colors, float[] positions) {
        this.gradientAngle = angle;
        this.gradientColors = colors;
        this.gradientPositions = positions;

        invalidate();
    }

    public boolean hasGradient() {
        return this.gradientColors != null;
    }

    public void setUnderline(boolean underline) {
        this.underline = underline;
        getPaint().setUnderlineText(underline);
    }

    public void setStrikethrough(boolean strikethrough) {
        this.strikethrough = strikethrough;
        getPaint().setStrikeThruText(strikethrough);
    }

    @Override
    protected void onDraw(Canvas canvas) {

        if (hasGradient()) {
            if (hasShadow() || strikethrough || underline) {
                getPaint().setShader(null);

                // draw the shadow
                if (hasShadow()) {
                    // shadowColor must be opaque.
                    setTextColor(0x00ffffff);
                    getPaint().setAlpha((int) (255 * shadowAlpha));
                    getPaint().setShadowLayer(shadowRadius, shadowDx, shadowDy, shadowColor);
                }
                getPaint().setStrikeThruText(strikethrough);
                getPaint().setUnderlineText(underline);

                super.onDraw(canvas);
            }

            // draw the gradient filled text
            if (hasShadow()) {
                getPaint().clearShadowLayer();
            }

            // gradient colors must be opaque, too.
            setGradientTextColor(this, this.gradientAngle, this.gradientColors, this.gradientPositions);
            super.onDraw(canvas);
        } else {
            super.onDraw(canvas);
        }
    }

    public static void setGradientTextColor(final TextView textView, final float angle, final int[] colors, final float[] positions) {
        final Rect textBound = new Rect(Integer.MAX_VALUE, Integer.MAX_VALUE, Integer.MIN_VALUE, Integer.MIN_VALUE);

        final Layout layout = textView.getLayout();

        if (layout == null) {
            return;
        }

        for (int i = 0; i < textView.getLineCount(); i++) {
            float left = layout.getLineLeft(i);
            float right = layout.getLineRight(i);
            if (left < textBound.left) textBound.left = (int) left;
            if (right > textBound.right) textBound.right = (int) right;
        }
        textBound.top = layout.getLineTop(0);
        textBound.bottom = layout.getLineBottom(textView.getLineCount() - 1);
        if (textView.getIncludeFontPadding()) {
            Paint.FontMetrics fontMetrics = textView.getPaint().getFontMetrics();
            textBound.top += (fontMetrics.ascent - fontMetrics.top);
            textBound.bottom -= (fontMetrics.bottom - fontMetrics.descent);
        }

        double angleInRadians = Math.toRadians(angle);

        double r = Math.sqrt(Math.pow(textBound.bottom - textBound.top, 2) +
                Math.pow(textBound.right - textBound.left, 2)) / 2;

        float centerX = textBound.left + (textBound.right - textBound.left) / 2.f;
        float centerY = textBound.top + (textBound.bottom - textBound.top) / 2.f;

        float startX = (float) (centerX - r * Math.cos(angleInRadians));
        float startY = (float) (centerY + r * Math.sin(angleInRadians));

        float endX = (float) (centerX + r * Math.cos(angleInRadians));
        float endY = (float) (centerY - r * Math.sin(angleInRadians));

        Shader textShader = new LinearGradient(startX, startY, endX, endY, colors, positions,
                Shader.TileMode.CLAMP);

        textView.setTextColor(0xffffffff);
        textView.getPaint().setShader(textShader);
    }

    public void reset() {
        strikethrough = false;
        underline = false;

        shadowAlpha = 0;
        shadowRadius = 0;
        shadowDx = 0;
        shadowDy = 0;
        shadowColor = Color.TRANSPARENT;

        gradientAngle = 0;
        gradientColors = null;
        gradientPositions = null;
        invalidate();
    }
}
