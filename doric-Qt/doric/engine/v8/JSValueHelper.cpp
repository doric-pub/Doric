#include "JSValueHelper.h"

#include <QJsonDocument>
#include <QJsonObject>

std::string JS2String(v8::Local<v8::Value> object) {
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

  v8::String::Utf8Value str(
      isolate, v8::JSON::Stringify(context, object).ToLocalChecked());
  return std::string(*str ? *str : "<string conversion failed>");
}

double JS2Number(v8::Local<v8::Value> value) {
  v8::HandleScope handleScope(v8::Isolate::GetCurrent());
  v8::Local<v8::Context> context =
      v8::Isolate::GetCurrent()->GetCurrentContext();
  if (value->IsNumber()) {
    return value->ToNumber(context).ToLocalChecked()->Value();
  } else {
    return 0;
  }
}

bool JS2Bool(v8::Local<v8::Value> value) {
  v8::HandleScope handleScope(v8::Isolate::GetCurrent());
  if (value->IsBoolean()) {
    return value->ToBoolean(v8::Isolate::GetCurrent())->Value();
  } else {
    return false;
  }
}

v8::Local<v8::Value> String2JS(std::string string) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::EscapableHandleScope handleScope(isolate);
  v8::Local<v8::Context> context = isolate->GetEnteredOrMicrotaskContext();
  v8::Local<v8::String> jsString = NewV8String(string.c_str());

  v8::Local<v8::Value> ret =
      v8::JSON::Parse(context, jsString).ToLocalChecked();

  return handleScope.Escape(ret);
}

v8::Local<v8::Value> Variant2JS(QVariant variant) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::EscapableHandleScope handle_scope(isolate);

  v8::Local<v8::Value> jsValue;
  if (variant.type() == QVariant::String) {
    jsValue = NewV8String(variant.toString().toUtf8().constData());
  } else if (variant.type() == QVariant::Map) {
    QMap<QString, QVariant> map = variant.toMap();

    QJsonObject jsonObject;
    foreach (QString key, map.keys()) {
      QVariant value = map.value(key);
      jsonObject.insert(key, QJsonValue::fromVariant(value));
    }
    QJsonDocument doc(jsonObject);
    QString strJson(doc.toJson(QJsonDocument::Compact));
    jsValue = String2JS(strJson.toUtf8().constData());
  } else if (variant.type() == QVariant::StringList) {
    qDebug() << "";
  }
  return handle_scope.Escape(jsValue);
}
