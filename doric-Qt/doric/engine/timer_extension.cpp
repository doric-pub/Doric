#include <QTimer>

#include "timer_extension.h"
#include "../utils/constant.h"

Q_INVOKABLE void TimerExtension::setTimer(long timerId, int time, bool repeat) {
    QTimer *timer = new QTimer(this);
    timer->setSingleShot(!repeat);
    connect(timer, &QTimer::timeout, this, [=] () {
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

Q_INVOKABLE void TimerExtension::clearTimer(long timerId) {
    deletedTimerIds->insert(timerId);
}
