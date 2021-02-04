#ifndef JSENGINE_H
#define JSENGINE_H

#include <QJSValue>
#include <QThreadPool>

#include "interface_jse.h"
#include "../registry.h"

class JSEngine : public QObject
{
    Q_OBJECT
private:
    InterfaceJSE *mJSE;
    Registry *mRegistry = new Registry();

    void loadBuiltinJS(QString assetName);
    QString packageContextScript(QString contextId, QString content);
    QString packageModuleScript(QString moduleName, QString content);
public:
    QThreadPool mJSThreadPool;

    explicit JSEngine(QObject *parent = nullptr);

    ~JSEngine();

    void prepareContext(QString contextId, QString script, QString source);
    QJSValue invokeDoricMethod(QString method, QVariantList arguments);
    Registry *getRegistry();
};

#endif // JSENGINE_H
