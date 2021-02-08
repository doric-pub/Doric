#include <QDebug>
#include <QJSValueIterator>

#include "../utils/DoricUtils.h"
#include "DoricNativeJSE.h"

DoricNativeJSE::DoricNativeJSE() {
  mJSEngine.installExtensions(QJSEngine::AllExtensions);
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
  QString script = DoricUtils::readAssetFile("/test", "test.js");
  mJSEngine.evaluate(script);

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
