#ifndef REGISTRY_H
#define REGISTRY_H

#include <QMap>

class Registry {

private:
    QMap<QString, QString> pluginInfoMap;

public:
    Registry();

    void registerNativePlugin(QString key, QString value);

    QString acquirePluginInfo(QString key);
};

#endif // REGISTRY_H
