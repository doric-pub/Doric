#ifndef CONTEXT_H
#define CONTEXT_H

#include <QString>
#include <QJsonObject>
#include <QJsonDocument>

#include "constant.h"
#include "driver/driver.h"
#include "driver/native_driver.h"

class Context
{

private:
    int contextId;
    QString *source;

public:
    Driver *driver = NativeDriver::getInstance();

    Context(int contextId, QString *source) {
        this->contextId = contextId;
        this->source = source;
    }

    void show() {
        QString *method = new QString(Constant::DORIC_ENTITY_SHOW);
        QVector<QString*> *arguments = new QVector<QString*>();

        driver->invokeContextEntityMethod(contextId, method, nullptr);

        delete arguments;
        delete method;
    }

    void init(double width, double height) {
        QJsonObject *jsonObject = new QJsonObject();
        jsonObject->insert("width", width);
        jsonObject->insert("height", height);

        QString *method = new QString(Constant::DORIC_ENTITY_INIT);
        QVariant *variant = new QVariant();
        variant->setValue(*jsonObject);

        driver->invokeContextEntityMethod(contextId, method, variant, nullptr);

        delete variant;
        delete method;
        delete jsonObject;
    }
};

#endif // CONTEXT_H
