#ifndef NATIVE_TIMER_H
#define NATIVE_TIMER_H

#include <QJSEngine>
#include <QObject>
#include <QSet>
#include <QTimer>

#include "constant.h"

class NativeTimer : public QObject {
    Q_OBJECT

private:
    QSet<long> *deletedTimerIds = new QSet<long>();
    QJSEngine* engine;

public:
    NativeTimer(QJSEngine* engine, QObject *parent = nullptr) : QObject(parent) {
        this->engine = engine;
    }

    Q_INVOKABLE void setTimer(long timerId, int time, bool repeat) {
        QTimer* timer = new QTimer(this);
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

    Q_INVOKABLE void clearTimer(long timerId) {
        deletedTimerIds->insert(timerId);
    }

};
#endif // NATIVE_TIMER_H
