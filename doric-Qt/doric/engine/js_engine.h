#ifndef JSENGINE_H
#define JSENGINE_H

#include <QJSValue>
#include <QThreadPool>

#include "interface_jse.h"

class JSEngine : public QObject
{
    Q_OBJECT
private:
    InterfaceJSE *mJSE;

    void loadBuiltinJS(QString assetName);
    QString packageContextScript(QString contextId, QString content);
    QString packageModuleScript(QString moduleName, QString content);
public:
    QThreadPool mJSThreadPool;

    explicit JSEngine(QObject *parent = nullptr);

    ~JSEngine();

    QJSValue invokeDoricMethod(QString method, QVariantList arguments);
    void prepareContext(QString contextId, QString script, QString source);
};

#endif // JSENGINE_H
