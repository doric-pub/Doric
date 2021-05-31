#include "DoricAsyncResult.h"

#include <QWaitCondition>

DoricAsyncResult::DoricAsyncResult() {}

void DoricAsyncResult::setResult(QString result) {
  this->result = result;
  this->resultCallback();
}

void DoricAsyncResult::setError(QString exception) { this->result = exception; }

bool DoricAsyncResult::hasResult() { return !(result.isEmpty()); }

QString DoricAsyncResult::getResult() { return this->result; }

QString DoricAsyncResult::waitUntilResult() {
  if (hasResult()) {
    return this->result;
  }

  QMutex mutex;
  QWaitCondition condition;
  this->resultCallback = [&condition]() { condition.wakeAll(); };

  mutex.lock();
  condition.wait(&mutex);
  mutex.unlock();
  return this->result;
}
