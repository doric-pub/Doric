#include "JSValueHelper.h"

#include <QJsonDocument>
#include <QJsonObject>

std::string ToString(v8::Local<v8::Value> object) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  if (object->IsString() || object->IsRegExp() || object->IsFunction()) {
    v8::String::Utf8Value utf8(isolate, object);
    return std::string(*utf8);
  }
  if (object->IsObject()) {
    v8::MaybeLocal<v8::String> str = v8::JSON::Stringify(
        context, object->ToObject(context).ToLocalChecked());
    if (str.IsEmpty()) {
      return "<string conversion failed>";
    }
    v8::Local<v8::String> s = str.ToLocalChecked();
    v8::String::Utf8Value str2(isolate, s);
    return std::string(*str2 ? *str2 : "<string conversion failed>");
  }

  v8::Local<v8::Object> global = context->Global();
  v8::Local<v8::Object> JSON = global->Get(context, NewV8String("JSON"))
                                   .ToLocalChecked()
                                   ->ToObject(context)
                                   .ToLocalChecked();
  v8::Local<v8::Value> argv[] = {object};
  v8::Local<v8::Function> JSON_stringify = v8::Local<v8::Function>::Cast(
      JSON->Get(context, NewV8String("stringify")).ToLocalChecked());
  v8::String::Utf8Value str(
      isolate, JSON_stringify->Call(context, JSON, 1, argv).ToLocalChecked());
  return std::string(*str ? *str : "<string conversion failed>");
}

v8::Local<v8::Value> ObjectToJS(QObject *object) {
  QJsonObject jsonObject;

  QList<QByteArray> propertyNames = object->dynamicPropertyNames();
  foreach (QByteArray propertyName, propertyNames) {
    QString key = QString::fromStdString(propertyName.toStdString());
    object->property(propertyName).toString();
    if (key == "undefined" || key.isEmpty()) {

    } else {
      jsonObject[key] = QJsonValue::fromVariant(object->property(propertyName));
    }
  }

  QJsonDocument doc(jsonObject);
  QString strJson(doc.toJson(QJsonDocument::Compact));

  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::EscapableHandleScope handleScope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::String> jsString = NewV8String(strJson.toUtf8().constData());

  v8::Local<v8::Value> ret = v8::JSON::Parse(context, jsString).ToLocalChecked();

  return handleScope.Escape(ret);
}
