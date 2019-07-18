package com.github.pengfeizhou.hego;

import android.content.Context;
import android.os.Build;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.annotation.RequiresApi;
import android.util.AttributeSet;
import android.widget.FrameLayout;

/**
 * @Description: Hego
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class HegoPanel extends FrameLayout {

    private HegoContext mHegoContext;

    public HegoPanel(@NonNull Context context) {
        super(context);
    }

    public HegoPanel(@NonNull Context context, @Nullable AttributeSet attrs) {
        super(context, attrs);
    }

    public HegoPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr) {
        super(context, attrs, defStyleAttr);
    }

    @RequiresApi(api = Build.VERSION_CODES.LOLLIPOP)
    public HegoPanel(@NonNull Context context, @Nullable AttributeSet attrs, int defStyleAttr, int defStyleRes) {
        super(context, attrs, defStyleAttr, defStyleRes);
    }

    public void config(String script, String alias) {
        HegoContext hegoContext = HegoContext.createContext(script, alias);
        config(hegoContext);
    }

    public void config(HegoContext hegoContext) {
        mHegoContext = hegoContext;
    }

    @Override
    protected void onFinishInflate() {
        super.onFinishInflate();
    }

    public HegoContext getHegoContext() {
        return mHegoContext;
    }
}
