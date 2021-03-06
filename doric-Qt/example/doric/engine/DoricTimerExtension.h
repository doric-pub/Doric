#ifndef NATIVETIMER_H
#define NATIVETIMER_H

#include <QObject>
#include <QSet>

#include "DoricExport.h"

class DORIC_EXPORT DoricTimerExtension : public QObject {
  Q_OBJECT

private:
  QSet<long> *deletedTimerIds = new QSet<long>();
  std::function<void(long)> method;

public:
  explicit DoricTimerExtension(std::function<void(long)> method,
                               QObject *parent = nullptr)
      : QObject(parent) {
    this->method = method;
  }

  Q_INVOKABLE void setTimer(long timerId, int time, bool repeat);

  Q_INVOKABLE void clearTimer(long timerId);

signals:
  void startTimer();
};
#endif // NATIVETIMER_H
