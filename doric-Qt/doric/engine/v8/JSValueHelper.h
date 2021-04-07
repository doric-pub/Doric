#ifndef JSVALUEHELPER_H
#define JSVALUEHELPER_H

#include <QVariant>
#include <string>

#include "v8.h"

#define NewV8String(name)                                                      \
  v8::String::NewFromUtf8(v8::Isolate::GetCurrent(), name,                     \
                          v8::NewStringType::kNormal)                          \
      .ToLocalChecked()

std::string JS2String(v8::Local<v8::Value> object);

double JS2Number(v8::Local<v8::Value> value);

bool JS2Bool(v8::Local<v8::Value> value);

v8::Local<v8::Value> String2JS(std::string string);

v8::Local<v8::Value> Variant2JS(QVariant variant);

#endif // JSVALUEHELPER_H
