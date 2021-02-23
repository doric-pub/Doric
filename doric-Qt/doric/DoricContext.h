#ifndef CONTEXT_H
#define CONTEXT_H

#include <QQmlEngine>
#include <QVariant>

#include "DoricInterfaceDriver.h"

class DoricViewNode;
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
  QQmlEngine *mQmlEngine;

public:
  DoricContext(QString contextId, QString source, QString extra);

  static DoricContext *create(QString script, QString source, QString extra);

  void init(QString initData);

  void build(int width, int height);

  void callEntity(QString methodName, QVariantList args);

  DoricInterfaceDriver *getDriver();

  DoricRootNode *getRootNode();

  QObject *obtainPlugin(QString name);

  void setQmlEngine(QQmlEngine *engine);

  QQmlEngine *getQmlEngine();

  DoricViewNode *targetViewNode(QString id);
};

#endif // CONTEXT_H
