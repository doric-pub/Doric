#ifndef REGISTRY_H
#define REGISTRY_H

#include <QMap>

class Registry {

private:
    QMap<QString, QString> pluginInfoMap;

public:
    Registry();

    void registerNativePlugin(QString name);
};

#endif // REGISTRY_H
