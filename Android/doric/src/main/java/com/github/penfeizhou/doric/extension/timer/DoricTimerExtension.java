package com.github.penfeizhou.doric.extension.timer;

import android.os.Handler;
import android.os.Looper;
import android.os.Message;

import java.util.HashSet;
import java.util.Set;

/**
 * @Description: Doric
 * @Author: pengfei.zhou
 * @CreateDate: 2019-07-18
 */
public class DoricTimerExtension implements Handler.Callback {

    private static final int MSG_TIMER = 0;
    private final Handler mTimerHandler;
    private final TimerCallback mTimerCallback;
    private Set<Long> mDeletedTimerIds = new HashSet<>();

    public DoricTimerExtension(Looper looper, TimerCallback timerCallback) {
        mTimerHandler = new Handler(looper, this);
        mTimerCallback = timerCallback;
    }

    public void setTimer(long timerId, long time, boolean repeat) {
        TimerInfo timerInfo = new TimerInfo();
        timerInfo.timerId = timerId;
        timerInfo.time = time;
        timerInfo.repeat = repeat;
        mTimerHandler.sendMessageDelayed(Message.obtain(mTimerHandler, MSG_TIMER, timerInfo), timerInfo.time);
    }

    public void clearTimer(long timerId) {
        mDeletedTimerIds.add(timerId);
    }

    @Override
    public boolean handleMessage(Message msg) {
        if (msg.obj instanceof TimerInfo) {
            TimerInfo timerInfo = (TimerInfo) msg.obj;
            if (mDeletedTimerIds.contains(timerInfo.timerId)) {
                mDeletedTimerIds.remove(timerInfo.timerId);
            } else {
                mTimerCallback.callback(timerInfo.timerId);
                if (timerInfo.repeat) {
                    mTimerHandler.sendMessageDelayed(Message.obtain(mTimerHandler, MSG_TIMER, timerInfo), timerInfo.time);
                } else {
                    mDeletedTimerIds.remove(timerInfo.timerId);
                }
            }
        }
        return true;
    }

    private class TimerInfo {
        long timerId;
        long time;
        boolean repeat;
    }

    public interface TimerCallback {
        void callback(long timerId);
    }
}
