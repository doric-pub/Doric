#include <QDebug>
#include <QJSValueIterator>

#include "../utils/DoricUtils.h"
#include "DoricNativeJSE.h"

DoricNativeJSE::DoricNativeJSE() {
  mJSEngine.installExtensions(QJSEngine::AllExtensions);

  std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
  v8::V8::InitializePlatform(platform.get());
  v8::V8::Initialize();

  v8::Isolate::CreateParams create_params;
  create_params.array_buffer_allocator =
      v8::ArrayBuffer::Allocator::NewDefaultAllocator();
  v8::Isolate *isolate = v8::Isolate::New(create_params);

  {
    v8::Isolate::Scope isolate_scope(isolate);

    // Create a stack-allocated handle scope.
    v8::HandleScope handle_scope(isolate);

    // Create a new context.
    v8::Local<v8::Context> context = v8::Context::New(isolate);

    // Enter the context for compiling and running the hello world script.
    v8::Context::Scope context_scope(context);

    {
      // Create a string containing the JavaScript source code.
      v8::Local<v8::String> source =
          v8::String::NewFromUtf8Literal(isolate, "'Hello' + ', World!'");

      // Compile the source code.
      v8::Local<v8::Script> script =
          v8::Script::Compile(context, source).ToLocalChecked();

      // Run the script to get the result.
      v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

      // Convert the result to an UTF8 string and print it.
      v8::String::Utf8Value utf8(isolate, result);
      printf("%s\n", *utf8);
    }

    {
      // Use the JavaScript API to generate a WebAssembly module.
      //
      // |bytes| contains the binary format for the following module:
      //
      //     (func (export "add") (param i32 i32) (result i32)
      //       get_local 0
      //       get_local 1
      //       i32.add)
      //
      const char csource[] = R"(
          let bytes = new Uint8Array([
            0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00, 0x01, 0x07, 0x01,
            0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f, 0x03, 0x02, 0x01, 0x00, 0x07,
            0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00, 0x0a, 0x09, 0x01,
            0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b
          ]);
          let module = new WebAssembly.Module(bytes);
          let instance = new WebAssembly.Instance(module);
          instance.exports.add(3, 4);
        )";

      // Create a string containing the JavaScript source code.
      v8::Local<v8::String> source =
          v8::String::NewFromUtf8Literal(isolate, csource);

      // Compile the source code.
      v8::Local<v8::Script> script =
          v8::Script::Compile(context, source).ToLocalChecked();

      // Run the script to get the result.
      v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

      // Convert the result to a uint32 and print it.
      uint32_t number = result->Uint32Value(context).ToChecked();
      printf("3 + 4 = %u\n", number);
    }
  }

  // Dispose the isolate and tear down V8.
  isolate->Dispose();
  v8::V8::Dispose();
  v8::V8::ShutdownPlatform();
  delete create_params.array_buffer_allocator;
}

QString DoricNativeJSE::loadJS(QString script, QString source) {
  return mJSEngine.evaluate(script, source).toString();
}

void DoricNativeJSE::injectGlobalJSObject(QString name, QObject *object) {
  QJSValue jsObject = mJSEngine.newQObject(object);

  QList<QByteArray> propertyNames = object->dynamicPropertyNames();
  foreach (QByteArray propertyName, propertyNames) {
    QString key = QString::fromStdString(propertyName.toStdString());
    if (key == "undefined") {

    } else {
      jsObject.setProperty(
          key, mJSEngine.toScriptValue(object->property(propertyName)));
    }
  }

  mJSEngine.globalObject().setProperty(name, jsObject);
}

void DoricNativeJSE::injectGlobalJSFunction(QString name, QObject *function,
                                            QString property) {
  QJSValue functionObject = mJSEngine.newQObject(function);
  mJSEngine.globalObject().setProperty(name, functionObject.property(property));
}

QJSValue DoricNativeJSE::invokeObject(QString objectName, QString functionName,
                                      QVariantList arguments) {
  QJSValue object = mJSEngine.evaluate(objectName);
  QJSValue function = object.property(functionName);

  QJSValueList args;
  foreach (QVariant variant, arguments) {
    if (variant.type() == QVariant::String) {
      args.push_back(QJSValue(variant.toString()));
    } else if (variant.type() == QVariant::Map) {
      QJSValue arg = mJSEngine.newObject();
      QMap<QString, QVariant> map = variant.toMap();
      foreach (QString key, map.keys()) {
        QVariant value = map.value(key);
        if (value.type() == QVariant::String) {
          arg.setProperty(key, value.toString());
        } else if (value.type() == QVariant::Int) {
          arg.setProperty(key, value.toInt());
        }
      }
      args.push_back(arg);
    } else if (variant.type() == QVariant::StringList) {
      QStringList array = variant.toStringList();
      QJSValue arg = mJSEngine.newArray(array.size());

      for (int i = 0; i != array.size(); i++) {
        arg.setProperty(i, array.at(i));
      }
      args.push_back(arg);
    }
  }

  QJSValue result = function.call(args);
  if (result.isError()) {
    qCritical() << "++++++++++++++++++++++++++++++++++++++++++++++++";
    qCritical() << result.toString();
    QStringList stacktraces = result.property("stack").toString().split("\n");
    foreach (QString stacktrace, stacktraces) { qDebug() << stacktrace; }
    qCritical() << "------------------------------------------------";
  }

  return result;
}
