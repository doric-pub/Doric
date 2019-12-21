#include <QJsonObject>
#include <QJsonDocument>

#include "constant.h"
#include "context.h"
#include "driver/native_driver.h"

Context::Context(int contextId, QString *source) {
    this->driver = NativeDriver::getInstance();

    this->contextId = contextId;
    this->source = source;
}

void Context::show() {
    QString *method = new QString(Constant::DORIC_ENTITY_SHOW);
    QVector<QString*> *arguments = new QVector<QString*>();

    driver->invokeContextEntityMethod(contextId, method, nullptr);

    delete arguments;
    delete method;
}

void Context::init(double width, double height) {
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
