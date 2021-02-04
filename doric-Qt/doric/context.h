#ifndef CONTEXT_H
#define CONTEXT_H

#include <QVariant>

#include "interface_driver.h"
#include "shader/root_node.h"

class Context
{
private:
    QString mContextId;
    QMap<QString, QObject*> mPluginMap;
    RootNode *mRootNode;
    QString source;
    QString script;
    QString extra;
    QVariant initParams;
    InterfaceDriver *driver = NULL;

public:
    Context(QString contextId, QString source, QString extra);

    static Context* create(QString script, QString source, QString extra);

    void init(QString initData);

    void build(int width, int height);

    void callEntity(QString methodName, QVariantList args);

    InterfaceDriver* getDriver();

    QObject* obtainPlugin(QString name);
};

#endif // CONTEXT_H
