#include <QCoreApplication>
#include <QTimer>

#include "../utils/DoricConstant.h"
#include "DoricTimerExtension.h"

Q_INVOKABLE void DoricTimerExtension::setTimer(long timerId, int time,
                                               bool repeat) {

  connect(this, &DoricTimerExtension::startTimer, qApp, [=]() {
    QTimer *timer = new QTimer();
    timer->setSingleShot(!repeat);

    connect(timer, &QTimer::timeout, [=]() {
      if (deletedTimerIds->contains(timerId)) {
        deletedTimerIds->remove(timerId);
        timer->deleteLater();
      } else {
        this->method(timerId);

        if (!repeat) {
          deletedTimerIds->remove(timerId);
          timer->deleteLater();
        }
      }
    });

    timer->start(time);
  });

  emit startTimer();
}

Q_INVOKABLE void DoricTimerExtension::clearTimer(long timerId) {
  deletedTimerIds->insert(timerId);
}
