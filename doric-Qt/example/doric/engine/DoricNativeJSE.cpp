#include <QDebug>
#include <QJsonDocument>
#include <QJsonObject>

#include "../utils/DoricUtils.h"
#include "DoricNativeJSE.h"

DoricNativeJSE::DoricNativeJSE(JSEType type) {
  mType = type;
  if (mType == JSEType::V8) {
    v8Executor = new V8Executor();
  } else if (mType == JSEType::Native) {
    nativeExecutor = new NativeExecutor();
  }
}

QString DoricNativeJSE::loadJS(QString script, QString source) {
  if (mType == JSEType::V8) {
    return v8Executor->loadJS(script, source);
  } else if (mType == JSEType::Native) {
    return nativeExecutor->loadJS(script, source);
  }
}

void DoricNativeJSE::injectGlobalJSObject(QString name, QObject *object) {
  if (mType == JSEType::V8) {
    QJsonObject jsonObject;

    QList<QByteArray> propertyNames = object->dynamicPropertyNames();
    foreach (QByteArray propertyName, propertyNames) {
      QString key = QString::fromStdString(propertyName.toStdString());
      object->property(propertyName).toString();
      if (key == "undefined" || key.isEmpty()) {

      } else {
        jsonObject[key] =
            QJsonValue::fromVariant(object->property(propertyName));
      }
    }

    QJsonDocument doc(jsonObject);
    QString strJson(doc.toJson(QJsonDocument::Compact));

    v8Executor->injectGlobalJSObject(name, strJson.toUtf8().constData());
  } else if (mType == JSEType::Native) {
    nativeExecutor->injectGlobalJSObject(name, object);
  }
}

void DoricNativeJSE::injectGlobalJSFunction(QString name, QObject *function,
                                            QString property) {
  if (mType == JSEType::V8) {
    v8Executor->injectGlobalJSFunction(name, function, property);
  } else if (mType == JSEType::Native) {
    nativeExecutor->injectGlobalJSFunction(name, function, property);
  }
}

void DoricNativeJSE::invokeObject(QString objectName, QString functionName,
                                  QVariantList arguments) {
  if (mType == JSEType::V8) {
    v8Executor->invokeObject(objectName, functionName, arguments);
  } else if (mType == JSEType::Native) {
    nativeExecutor->invokeObject(objectName, functionName, arguments);
  }
}
