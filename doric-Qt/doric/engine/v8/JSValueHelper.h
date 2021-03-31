#ifndef JSVALUEHELPER_H
#define JSVALUEHELPER_H

#include <QVariant>
#include <string>

#include "v8/v8.h"

#define NewV8String(name)                                                      \
  v8::String::NewFromUtf8(v8::Isolate::GetCurrent(), name,                     \
                          v8::NewStringType::kNormal)                          \
      .ToLocalChecked()

std::string ToString(v8::Local<v8::Value> object);

v8::Local<v8::Value> ObjectToJS(QObject *object);

#endif // JSVALUEHELPER_H
