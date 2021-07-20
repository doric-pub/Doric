package pub.doric.shader.input;

import android.graphics.Typeface;
import android.text.TextPaint;
import android.text.style.MetricAffectingSpan;

public class CustomMetricAffectingSpan extends MetricAffectingSpan {
    private final Typeface _typeface;
    private final Float _newSize;
    private final Integer _newStyle;

    public CustomMetricAffectingSpan(Float size) {
        this(null, null, size);
    }

    public CustomMetricAffectingSpan(Float size, Integer style) {
        this(null, style, size);
    }

    public CustomMetricAffectingSpan(Typeface type, Integer style, Float size) {
        this._typeface = type;
        this._newStyle = style;
        this._newSize = size;
    }

    @Override
    public void updateDrawState(TextPaint ds) {
        applyNewSize(ds);
    }

    @Override
    public void updateMeasureState(TextPaint paint) {
        applyNewSize(paint);
    }

    private void applyNewSize(TextPaint paint) {
        if (this._newStyle != null)
            paint.setTypeface(Typeface.create(this._typeface, this._newStyle));
        else
            paint.setTypeface(this._typeface);

        if (this._newSize != null)
            paint.setTextSize(this._newSize);
    }
}