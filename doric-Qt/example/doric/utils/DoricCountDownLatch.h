#ifndef COUNTDOWNLATCH_H
#define COUNTDOWNLATCH_H

#include <QSemaphore>
#include <climits>

class DoricCountDownLatch {
  Q_DISABLE_COPY(DoricCountDownLatch)
  QSemaphore m_sem{INT_MAX};

public:
  DoricCountDownLatch() {}
  ~DoricCountDownLatch() {
    m_sem.acquire(INT_MAX);
    m_sem.release(INT_MAX);
  }
  class Locker {
    DoricCountDownLatch *sem;

  public:
    Locker(const Locker &other) : sem{other.sem} { sem->m_sem.acquire(); }
    Locker(Locker &&other) : sem{other.sem} { other.sem = nullptr; }
    Locker(DoricCountDownLatch *sem) : sem{sem} { sem->m_sem.acquire(); }
    ~Locker() {
      if (sem)
        sem->m_sem.release();
    }
  };
  Locker lock() { return Locker{this}; }
};

#endif // COUNTDOWNLATCH_H
