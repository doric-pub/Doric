#ifndef ASYNCRESULT_H
#define ASYNCRESULT_H

#include <QString>

#include "DoricExport.h"

class DORIC_EXPORT DoricAsyncResult {
private:
  QString result;

public:
  std::function<void()> resultCallback;
  std::function<void()> exceptionCallback;
  std::function<void()> finishCallback;

  DoricAsyncResult();

  void setResult(QString result);

  void setError(QString exception);

  bool hasResult();

  QString getResult();

  QString waitUntilResult();
};

#endif // ASYNCRESULT_H
