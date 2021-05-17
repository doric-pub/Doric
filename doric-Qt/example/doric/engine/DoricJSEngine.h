#ifndef JSENGINE_H
#define JSENGINE_H

#include <QJSValue>
#include <QThreadPool>

#include "../DoricRegistry.h"
#include "DoricInterfaceJSE.h"

class DoricJSEngine : public QObject {
  Q_OBJECT
private:
  DoricInterfaceJSE *mJSE;
  DoricRegistry *mRegistry = DoricRegistry::getInstance();

  void loadBuiltinJS(QString assetName);
  QString packageContextScript(QString contextId, QString content);
  QString packageModuleScript(QString moduleName, QString content);

public:
  QThreadPool mJSThreadPool;

  explicit DoricJSEngine(QObject *parent = nullptr);

  ~DoricJSEngine();

  void prepareContext(QString contextId, QString script, QString source);

  void destroyContext(QString contextId);

  void invokeDoricMethod(QString method, QVariantList arguments);

  DoricRegistry *getRegistry();
};

#endif // JSENGINE_H
