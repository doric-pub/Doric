#ifndef V8EXECUTOR_H
#define V8EXECUTOR_H

#include "libplatform/libplatform.h"
#include "v8/v8.h"

#include <QObject>
#include <QString>

class V8Executor {

private:
  v8::Isolate::CreateParams create_params;
  v8::Isolate *m_isolate;
  v8::Isolate::Scope *m_isolate_scope;
  v8::Global<v8::Context> *m_global_context;

  v8::Local<v8::Value> innerExec(const char *script, const char *source,
                                 std::string *exception_str);

public:
  V8Executor();

  ~V8Executor();

  QString loadJS(QString script, QString source);

  void injectGlobalJSObject(QString name, QObject *object);
};

#endif // V8EXECUTOR_H
