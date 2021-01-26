import 'dart:async';

class DoricTimerExtension {
  static final int MSG_TIMER = 0;

  Map<int, Timer> mTimers = {};

  TimeCallback timeCallback;

  DoricTimerExtension(this.timeCallback);

  void setTimer(int timerId, int time, bool repeat) {
    var duration = Duration(milliseconds: time);
    Timer timer;
    if (repeat) {
      timer = Timer.periodic(duration, (timer) {
        if (timeCallback != null) {
          timeCallback.callback(timerId);
        }
      });
    } else {
      timer = Timer(Duration(milliseconds: time), () {
        if (timeCallback != null) {
          timeCallback.callback(timerId);
        }
      });
    }
    mTimers[timerId] = timer;
  }

  void clearTimer(int timerId){
    var timer=mTimers.remove(timerId);
      if(timer!=null&&timer.isActive){
        timer.cancel();
        timer=null;
      }
  }

  void teardown(){
    mTimers.forEach((key, value) {
      if(value.isActive){
        value.cancel();
      }
    });
    mTimers.clear();
  }
}

abstract class TimeCallback {
  void callback(int timeId);
}
