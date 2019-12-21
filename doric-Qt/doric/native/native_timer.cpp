#include <QTimer>

#include "native_timer.h"

Q_INVOKABLE void NativeTimer::setTimer(long timerId, int time, bool repeat) {
    QTimer *timer = new QTimer(this);
    timer->setSingleShot(!repeat);
    connect(timer, &QTimer::timeout, this, [=] () {
        if (deletedTimerIds->contains(timerId)) {
            deletedTimerIds->remove(timerId);
            delete timer;
        } else {
            engine->evaluate(
                        Constant::GLOBAL_DORIC + "." +
                        Constant::DORIC_TIMER_CALLBACK + "(" +
                        QString::number(timerId) + ")"
                        );

            if (!repeat) {
                deletedTimerIds->remove(timerId);
                delete timer;
            }
        }
    });
    timer->start(time);
}

void NativeTimer::clearTimer(long timerId) {
    deletedTimerIds->insert(timerId);
}
