#ifndef NATIVE_TIMER_H
#define NATIVE_TIMER_H

#include <QJSEngine>
#include <QObject>
#include <QSet>

#include "constant.h"

class NativeTimer : public QObject {
    Q_OBJECT

private:
    QSet<long> *deletedTimerIds = new QSet<long>();
    QJSEngine *engine;

public:
    NativeTimer(QJSEngine *engine, QObject *parent = nullptr) : QObject(parent) {
        this->engine = engine;
    }

    Q_INVOKABLE void setTimer(long timerId, int time, bool repeat);

    Q_INVOKABLE void clearTimer(long timerId);

};
#endif // NATIVE_TIMER_H
