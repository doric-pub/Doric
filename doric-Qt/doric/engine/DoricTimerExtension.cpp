#include <QTimer>

#include "../utils/DoricConstant.h"
#include "DoricTimerExtension.h"

Q_INVOKABLE void DoricTimerExtension::setTimer(long timerId, int time,
                                               bool repeat) {
  QTimer *timer = new QTimer(this);
  timer->setSingleShot(!repeat);
  connect(timer, &QTimer::timeout, this, [=]() {
    if (deletedTimerIds->contains(timerId)) {
      deletedTimerIds->remove(timerId);
      delete timer;
    } else {
      this->method(timerId);

      if (!repeat) {
        deletedTimerIds->remove(timerId);
        delete timer;
      }
    }
  });
  timer->start(time);
}

Q_INVOKABLE void DoricTimerExtension::clearTimer(long timerId) {
  deletedTimerIds->insert(timerId);
}
