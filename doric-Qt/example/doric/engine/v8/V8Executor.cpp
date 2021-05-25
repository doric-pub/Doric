#include <QDebug>

#include "JSValueHelper.h"
#include "V8Executor.h"

V8Executor::V8Executor() : platform(v8::platform::NewDefaultPlatform()) {
  v8::V8::InitializeICUDefaultLocation("");
  v8::V8::InitializeExternalStartupData("");
  v8::V8::InitializePlatform(platform.get());
  v8::V8::Initialize();

  create_params.array_buffer_allocator =
      v8::ArrayBuffer::Allocator::NewDefaultAllocator();
  m_isolate = v8::Isolate::New(create_params);
  m_isolate_scope = new v8::Isolate::Scope(m_isolate);

  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope scope(isolate);

  v8::Local<v8::ObjectTemplate> global = v8::ObjectTemplate::New(isolate);
  v8::Local<v8::Context> context = v8::Context::New(isolate, nullptr, global);
  context->Enter();
  m_global_context = new v8::Global<v8::Context>(isolate, context);
}

V8Executor::~V8Executor() {
  {
    v8::HandleScope scope(m_isolate);
    v8::Local<v8::Context> context = m_global_context->Get(m_isolate);
    context->Exit();
  }
  m_global_context->Reset();
  delete m_global_context;
  delete m_isolate_scope;
  m_isolate->Dispose();
  v8::V8::Dispose();
  v8::V8::ShutdownPlatform();
  delete create_params.array_buffer_allocator;
}

QString V8Executor::loadJS(QString script, QString source) {
  v8::Isolate *isolate = m_isolate;

  std::string exception;

  v8::HandleScope scope(isolate);
  v8::Local<v8::Value> ret = innerExec(script.toUtf8().constData(),
                                       source.toUtf8().constData(), &exception);
  std::string result = JS2String(ret);

  return QString::fromUtf8(result.c_str());
}

void V8Executor::injectGlobalJSObject(QString name, std::string target) {
  v8::Isolate *isolate = m_isolate;
  v8::HandleScope handleScope(isolate);

  v8::Local<v8::Value> local = String2JS(target);

  injectObject(name.toUtf8().constData(), local);
}

void V8Executor::injectGlobalJSFunction(QString name, QObject *function,
                                        QString property) {
  if (map->keys().contains(name)) {
    qCritical() << "already injected";
    return;
  } else {
    QPair<QObject *, QString> pair(function, property);
    map->insert(name, pair);
  }
  injectFunctions(nullptr, name.toUtf8().constData(), true);
}

QString V8Executor::invokeObject(QString objectName, QString functionName,
                                 QVariantList arguments) {
  std::string exception;
  v8::HandleScope handleScope(m_isolate);
  int valueSize = arguments.size();

  auto js_values = new v8::Local<v8::Value>[valueSize];
  for (int i = 0; i < valueSize; i++) {
    js_values[i] = Variant2JS(arguments.at(i));
  }
  v8::Local<v8::Value> value = invokeMethod(objectName.toUtf8().constData(),
                                            functionName.toUtf8().constData(),
                                            valueSize, js_values, &exception);
  delete[] js_values;

  std::string result = JS2String(value);
  return QString::fromUtf8(result.c_str());
}

// private segment
void V8Executor::injectObject(const char *string, v8::Local<v8::Value> local) {
  v8::Isolate *isolate = m_isolate;

  v8::HandleScope handle_scope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::Object> object = context->Global();
  v8::Maybe<bool> result = object->Set(context, NewV8String(string), local);
  result.ToChecked();
}

v8::Local<v8::Value> V8Executor::innerExec(const char *script,
                                           const char *source,
                                           std::string *exception_str) {
  v8::Isolate *isolate = m_isolate;

  v8::EscapableHandleScope handle_scope(isolate);
  v8::Local<v8::Value> result = Undefined(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Context::Scope context_scope(context);
  v8::ScriptOrigin origin(NewV8String(source));
  if (script) {
    v8::Local<v8::String> jsSource = NewV8String(script);
    v8::TryCatch try_catch(isolate);
    try_catch.SetVerbose(true);

    v8::MaybeLocal<v8::Script> maybeScript =
        v8::Script::Compile(context, jsSource, &origin);

    if (!maybeScript.IsEmpty()) {
      v8::Local<v8::Script> js_script = maybeScript.ToLocalChecked();
      v8::MaybeLocal<v8::Value> res = js_script->Run(context);
      if (!res.IsEmpty()) {
        result = res.ToLocalChecked();
      }
    }

    v8::Local<v8::Value> exception = try_catch.Exception();
    if (!exception.IsEmpty()) {
      if (exception->IsObject()) {
        v8::Local<v8::Object> exc = v8::Local<v8::Object>::Cast(exception);
        v8::Local<v8::Value> stack =
            exc->Get(context, NewV8String("stack")).FromMaybe(exception);
        *exception_str = JS2String(stack);
      } else {
        *exception_str = JS2String(exception);
      }
    }
  }
  return handle_scope.Escape(result);
}

static void InjectedFunction(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
  v8::HandleScope scope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::Object> data = args.Data()->ToObject(context).ToLocalChecked();

  std::string objectKey =
      JS2String(data->Get(context, NewV8String("obj")).ToLocalChecked())
          .c_str();
  std::string functionKey =
      JS2String(data->Get(context, NewV8String("func")).ToLocalChecked())
          .c_str();
  bool hashKey = data->Get(context, NewV8String("hashKey"))
                     .ToLocalChecked()
                     ->BooleanValue(isolate);

  // invoke
  QPair<QObject *, QString> pair =
      map->find(QString::fromUtf8(functionKey.c_str())).value();

  QString functionKeyQString = QString::fromUtf8(functionKey.c_str());

  if (args.Length() == 0) {
    if (functionKeyQString == "nativeEmpty") {
      QMetaObject::invokeMethod(pair.first, pair.second.toUtf8().constData(),
                                Qt::DirectConnection, QGenericReturnArgument());
    }
  } else if (args.Length() == 1) {
    if (functionKeyQString == "nativeRequire") {
      v8::Local<v8::Value> arg = args[0];
      std::string argString = JS2String(arg);

      QMetaObject::invokeMethod(
          pair.first, pair.second.toUtf8().constData(), Qt::DirectConnection,
          QGenericReturnArgument(),
          Q_ARG(QString, QString::fromUtf8(argString.c_str())));
    } else if (functionKeyQString == "nativeClearTimer") {
      v8::Local<v8::Value> arg = args[0];
      double number = JS2Number(arg);

      QMetaObject::invokeMethod(pair.first, pair.second.toUtf8().constData(),
                                Qt::DirectConnection, QGenericReturnArgument(),
                                Q_ARG(long, number));
    }

  } else if (args.Length() == 2) {
    v8::Local<v8::Value> arg0 = args[0];
    std::string argString0 = JS2String(arg0);

    v8::Local<v8::Value> arg1 = args[1];
    std::string argString1 = JS2String(arg1);

    QMetaObject::invokeMethod(
        pair.first, pair.second.toUtf8().constData(), Qt::DirectConnection,
        QGenericReturnArgument(),
        Q_ARG(QString, QString::fromUtf8(argString0.c_str())),
        Q_ARG(QString, QString::fromUtf8(argString1.c_str())));
  } else if (args.Length() == 3) {
    v8::Local<v8::Value> arg0 = args[0];
    long argLong = JS2Number(arg0);

    v8::Local<v8::Value> arg1 = args[1];
    int argInt = JS2Number(arg1);

    v8::Local<v8::Value> arg2 = args[2];
    bool argBool = JS2Bool(arg2);

    QMetaObject::invokeMethod(pair.first, pair.second.toUtf8().constData(),
                              Qt::DirectConnection, QGenericReturnArgument(),
                              Q_ARG(long, argLong), Q_ARG(int, argInt),
                              Q_ARG(bool, argBool));
  } else if (args.Length() == 5) {
    v8::Local<v8::Value> arg0 = args[0];
    std::string argString0 = JS2String(arg0);

    v8::Local<v8::Value> arg1 = args[1];
    std::string argString1 = JS2String(arg1);

    v8::Local<v8::Value> arg2 = args[2];
    std::string argString2 = JS2String(arg2);

    v8::Local<v8::Value> arg3 = args[3];
    std::string argString3 = JS2String(arg3);

    v8::Local<v8::Value> arg4 = args[4];
    std::string argString4 = JS2String(arg4);

    QMetaObject::invokeMethod(
        pair.first, pair.second.toUtf8().constData(), Qt::DirectConnection,
        QGenericReturnArgument(),
        Q_ARG(QString, QString::fromUtf8(argString0.c_str())),
        Q_ARG(QString, QString::fromUtf8(argString1.c_str())),
        Q_ARG(QString, QString::fromUtf8(argString2.c_str())),
        Q_ARG(QString, QString::fromUtf8(argString3.c_str())),
        Q_ARG(QString, QString::fromUtf8(argString4.c_str())));
  }

  // begin check to perform micro task checkpoint

  std::string objectNameString = "global";
  std::string functionKeyString = "nativeEmpty";

  int objectCompareResult = strncmp(objectKey.c_str(), objectNameString.c_str(),
                                    strlen(objectKey.c_str()));

  if (objectCompareResult == 0) {
    int functionCompareResult =
        strncmp(functionKey.c_str(), functionKeyString.c_str(),
                strlen(functionKey.c_str()));
    if (functionCompareResult == 0) {
      isolate->PerformMicrotaskCheckpoint();
    }
  }
  // end check
}

void V8Executor::injectFunctions(const char *objectName,
                                 const char *functionName, bool hashKey) {
  v8::Isolate *isolate = m_isolate;

  v8::HandleScope handle_scope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::Object> object = context->Global();
  if (objectName) {
    object = object->Get(context, NewV8String(objectName))
                 .ToLocalChecked()
                 ->ToObject(context)
                 .ToLocalChecked();
  }

  v8::Local<v8::String> name = NewV8String(functionName);
  v8::Local<v8::Object> data = v8::Object::New(isolate);
  if (objectName) {
    v8::Maybe<bool> result =
        data->Set(context, NewV8String("obj"), NewV8String(objectName));
    result.ToChecked();
  } else {
    v8::Maybe<bool> result =
        data->Set(context, NewV8String("obj"), NewV8String("global"));
    result.ToChecked();
  }
  {
    v8::Maybe<bool> result =
        data->Set(context, NewV8String("func"), NewV8String(functionName));
    result.ToChecked();
  }
  {
    v8::Maybe<bool> result = data->Set(context, NewV8String("hashKey"),
                                       v8::Boolean::New(isolate, hashKey));
    result.ToChecked();
  }

  v8::Local<v8::Function> function =
      v8::Function::New(context, InjectedFunction, data).ToLocalChecked();
  v8::Maybe<bool> result = object->Set(context, name, function);
  result.ToChecked();
}

v8::Local<v8::Value> V8Executor::invokeMethod(const char *objectName,
                                              const char *functionName,
                                              int argc,
                                              v8::Local<v8::Value> argv[],
                                              std::string *exception_str) {
  v8::Isolate *isolate = m_isolate;
  v8::EscapableHandleScope handle_scope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::Object> object = context->Global();
  v8::Local<v8::Value> result = Undefined(isolate);

  if (objectName) {
    object = object->Get(context, NewV8String(objectName))
                 .ToLocalChecked()
                 ->ToObject(context)
                 .ToLocalChecked();
  }
  if (object.IsEmpty()) {
    *exception_str = std::string("Cannot find Object:") +
                     std::string(objectName ? objectName : "global");
    return handle_scope.Escape(result);
  }
  v8::Local<v8::Value> target_value =
      object->Get(context, NewV8String(functionName)).ToLocalChecked();
  if (!target_value->IsFunction()) {
    *exception_str =
        std::string("In ") + std::string(objectName ? objectName : "global") +
        std::string("cannot find target function ") + std::string(functionName);
    return handle_scope.Escape(result);
  }
  v8::TryCatch try_catch(isolate);
  try_catch.SetVerbose(true);
  v8::Local<v8::Function> target_function =
      v8::Local<v8::Function>::Cast(target_value);
  result = target_function->Call(context, object, argc, argv).ToLocalChecked();
  v8::Local<v8::Value> exception = try_catch.Exception();
  if (!exception.IsEmpty()) {
    if (exception->IsObject()) {
      v8::Local<v8::Object> exc = v8::Local<v8::Object>::Cast(exception);
      v8::Local<v8::Value> stack =
          exc->Get(context, NewV8String("stack")).FromMaybe(exception);
      *exception_str = JS2String(stack);
    } else {
      *exception_str = JS2String(exception);
    }
  }
  return handle_scope.Escape(result);
}
