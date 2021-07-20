package pub.doric.shader.input;

import android.graphics.Typeface;
import android.text.SpannableString;
import android.text.Spanned;
import android.text.style.MetricAffectingSpan;

public class CustomHint extends SpannableString {
    public CustomHint(final CharSequence source, final int style) {
        this(null, source, style, null);
    }

    public CustomHint(final CharSequence source, final Float size) {
        this(null, source, size);
    }

    public CustomHint(final CharSequence source, final int style, final Float size) {
        this(null, source, style, size);
    }

    public CustomHint(final Typeface typeface, final CharSequence source, final int style) {
        this(typeface, source, style, null);
    }

    public CustomHint(final Typeface typeface, final CharSequence source, final Float size) {
        this(typeface, source, null, size);
    }

    public CustomHint(final Typeface typeface, final CharSequence source, final Integer style, final Float size) {
        super(source);

        MetricAffectingSpan typefaceSpan = new CustomMetricAffectingSpan(typeface, style, size);
        setSpan(typefaceSpan, 0, source.length(), Spanned.SPAN_INCLUSIVE_EXCLUSIVE);
    }
}