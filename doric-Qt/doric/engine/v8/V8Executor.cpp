#include "V8Executor.h"
#include "JSValueHelper.h"

#include <QThread>

V8Executor::V8Executor() {
  std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
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
  std::string exception;
  v8::HandleScope scope(m_isolate);
  v8::Local<v8::Value> ret = innerExec(script.toUtf8().constData(),
                                       source.toUtf8().constData(), &exception);
  std::string result = ToString(ret);

  return QString::fromUtf8(result.c_str());
}

void V8Executor::injectGlobalJSObject(QString name, QObject *target) {
  v8::HandleScope handleScope(v8::Isolate::GetCurrent());
  v8::Local<v8::Value> local = ObjectToJS(target);

  v8::Isolate *isolate = m_isolate;
  v8::HandleScope handle_scope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::Object> object = context->Global();
  v8::Maybe<bool> result =
      object->Set(context, NewV8String(name.toUtf8().constData()), local);
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
        *exception_str = ToString(stack);
      } else {
        *exception_str = ToString(exception);
      }
    }
  }
  return handle_scope.Escape(result);
}
