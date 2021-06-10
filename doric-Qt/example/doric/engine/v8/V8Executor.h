#ifndef V8EXECUTOR_H
#define V8EXECUTOR_H

#include "libplatform/libplatform.h"
#include "v8.h"

#include <QMap>
#include <QObject>
#include <QString>

#include "DoricExport.h"

static QMap<QString, QPair<QObject *, QString>> *map =
    new QMap<QString, QPair<QObject *, QString>>();

class DORIC_EXPORT V8Executor {

private:
  std::unique_ptr<v8::Platform> platform;
  v8::Isolate::CreateParams create_params;
  v8::Isolate *m_isolate;
  v8::Isolate::Scope *m_isolate_scope;
  v8::Global<v8::Context> *m_global_context;

  void injectObject(const char *string, v8::Local<v8::Value> local);

  v8::Local<v8::Value> innerExec(const char *script, const char *source,
                                 std::string *exception_str);

  void injectFunctions(const char *objectName, const char *functionName,
                       bool hashKey);

  v8::Local<v8::Value> invokeMethod(const char *objectName,
                                    const char *functionName, int argc,
                                    v8::Local<v8::Value> argv[],
                                    std::string *exception_str);

public:
  V8Executor();

  ~V8Executor();

  QString loadJS(QString script, QString source);

  void injectGlobalJSObject(QString name, std::string target);

  void injectGlobalJSFunction(QString name, QObject *function,
                              QString property);

  QString invokeObject(QString objectName, QString functionName,
                       QVariantList arguments);
};

#endif // V8EXECUTOR_H
