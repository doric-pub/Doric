#ifndef SHADERPLUGIN_H
#define SHADERPLUGIN_H

#include <QJSValue>
#include <QObject>

class ShaderPlugin : public QObject
{
    Q_OBJECT
public:
    ShaderPlugin(QObject* parent);

    Q_INVOKABLE void render(QJSValue jsValue, QString callbackId);
};

#endif // SHADERPLUGIN_H
