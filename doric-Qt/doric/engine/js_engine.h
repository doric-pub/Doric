#ifndef JSENGINE_H
#define JSENGINE_H

#include <QJSValue>
#include <QThreadPool>

#include "interface_jse.h"

class JSEngine : public QObject
{
    Q_OBJECT
private:
    QThreadPool mJSThreadPool;
    InterfaceJSE *mJSE;

    void loadBuiltinJS(QString assetName);
    void prepareContext(QString contextId, QString script, QString source);
    QString packageContextScript(QString contextId, QString content);
    QString packageModuleScript(QString moduleName, QString content);
public:
    explicit JSEngine(QObject *parent = nullptr);

    QJSValue invokeDoricMethod(QString method, QJSValueList arguments);

    ~JSEngine();
};

#endif // JSENGINE_H
