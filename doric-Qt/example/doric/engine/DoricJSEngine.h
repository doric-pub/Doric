#ifndef JSENGINE_H
#define JSENGINE_H

#include <QJSValue>
#include <QThreadPool>

#include "DoricExport.h"

#include "../DoricRegistry.h"
#include "DoricInterfaceJSE.h"

class DORIC_EXPORT DoricJSEngine : public QObject {
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

  QString prepareContext(QString contextId, QString script, QString source);

  QString destroyContext(QString contextId);

  QString invokeDoricMethod(QString method, QVariantList arguments);

  DoricRegistry *getRegistry();
};

#endif // JSENGINE_H
