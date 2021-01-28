#ifndef COUNTDOWNLATCH_H
#define COUNTDOWNLATCH_H

#include <climits>
#include <QSemaphore>

class CountDownLatch {
    Q_DISABLE_COPY(CountDownLatch)
    QSemaphore m_sem{INT_MAX};
public:
    CountDownLatch() {}
    ~CountDownLatch() {
        m_sem.acquire(INT_MAX);
        m_sem.release(INT_MAX);
    }
    class Locker {
        CountDownLatch * sem;
    public:
        Locker(const Locker & other) : sem{other.sem} { sem->m_sem.acquire(); }
        Locker(Locker && other) : sem{other.sem} { other.sem = nullptr; }
        Locker(CountDownLatch * sem) : sem{sem} { sem->m_sem.acquire(); }
        ~Locker() { if (sem) sem->m_sem.release(); }
    };
    Locker lock() { return Locker{this}; }
};

#endif // COUNTDOWNLATCH_H
