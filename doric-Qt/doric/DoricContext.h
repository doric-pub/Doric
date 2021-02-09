#ifndef CONTEXT_H
#define CONTEXT_H

#include <QVariant>

#include "DoricInterfaceDriver.h"

class DoricRootNode;

class DoricContext {
private:
  QString mContextId;
  QMap<QString, QObject *> mPluginMap;
  DoricRootNode *mRootNode;
  QString source;
  QString script;
  QString extra;
  QVariant initParams;
  DoricInterfaceDriver *driver = NULL;

public:
  DoricContext(QString contextId, QString source, QString extra);

  static DoricContext *create(QString script, QString source, QString extra);

  void init(QString initData);

  void build(int width, int height);

  void callEntity(QString methodName, QVariantList args);

  DoricInterfaceDriver *getDriver();

  DoricRootNode *getRootNode();

  QObject *obtainPlugin(QString name);
};

#endif // CONTEXT_H
