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
    QString* source;

public:
    Driver* driver = NativeDriver::getInstance();

    Context(int contextId, QString* source) {
        this->contextId = contextId;
        this->source = source;
    }

    void init(double width, double height) {
        QJsonObject* params = new QJsonObject();
        params->insert("width", width);
        params->insert("height", height);
        QJsonDocument* jsonDocument = new QJsonDocument();
        jsonDocument->setObject(*params);
        QString strJson(jsonDocument->toJson(QJsonDocument::Compact));

        delete params;
        delete jsonDocument;
    }
};

#endif // CONTEXT_H
