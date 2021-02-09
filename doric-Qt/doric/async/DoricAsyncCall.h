#ifndef ASYNC_CALL_H
#define ASYNC_CALL_H

#include <QFuture>
#include <QThreadPool>
#include <QtConcurrent/QtConcurrent>

class DoricAsyncCall {

public:
  static void ensureRunInThreadPool(QThreadPool *threadPool,
                                    std::function<void()> lambda) {
    QFuture<std::function<void()>::result_type> future =
        QtConcurrent::run(threadPool, lambda);
  }

  template <typename Function>
  static void ensureRunInMain(Function &&function) {
    struct Event : public QEvent {
      using DecayedFunction = typename std::decay<Function>::type;
      DecayedFunction decayedFunction;
      Event(DecayedFunction &&decayedFunction)
          : QEvent(QEvent::None), decayedFunction(std::move(decayedFunction)) {}
      Event(const DecayedFunction &decayedFunction)
          : QEvent(QEvent::None), decayedFunction(decayedFunction) {}
      ~Event() { decayedFunction(); }
    };
    QCoreApplication::postEvent(qApp,
                                new Event(std::forward<Function>(function)));
  }
};

#endif // ASYNC_CALL_H
