#ifndef UTILITY_H
#define UTILITY_H

#include <QJSEngine>
#include <QJsonArray>
#include <QJsonObject>
#include <QJsonValue>

class Utility {

public:
    static QJSValue convert(QJSEngine* jsEngine, QJsonValue jsonValue) {
        if (jsonValue.isBool()) {
            return QJSValue(jsonValue.toBool());
        } else if (jsonValue.isString()) {
            return QJSValue(jsonValue.toString());
        } else if (jsonValue.isDouble()) {
            return QJSValue(jsonValue.toDouble());
        } else if (jsonValue.isNull()) {
            return QJSValue(QJSValue::NullValue);
        } else if (jsonValue.isUndefined()) {
            return QJSValue(QJSValue::UndefinedValue);
        } else if (jsonValue.isObject()) {
            QJsonObject jsonObject = jsonValue.toObject();
            QJSValue jsValue = jsEngine->newObject();
            for (auto iterator = jsonObject.begin(); iterator != jsonObject.end(); iterator++) {
                QString key = iterator.key();
                QJsonValue value = iterator.value();
                QJSValue convertedValue = convert(jsEngine, value);
                jsValue.setProperty(key, convertedValue);
            }
            return jsValue;
        } else if (jsonValue.isArray()) {
            QJsonArray jsonArray = jsonValue.toArray();
            QJSValue jsValue = jsEngine->newArray(jsonArray.size());
            for (int i = 0; i < jsonArray.size(); i++) {
                QJsonValue value = jsonArray[i];
                QJSValue convertedValue = convert(jsEngine, value);
                jsValue.setProperty(i, convertedValue);
            }
            return jsValue;
        }

        return QJSValue(QJSValue::UndefinedValue);
    }
};

#endif // UTILITY_H
