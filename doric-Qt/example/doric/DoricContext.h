#ifndef CONTEXT_H
#define CONTEXT_H

#include <QQmlApplicationEngine>
#include <QVariant>

#include "DoricExport.h"

#include "DoricInterfaceDriver.h"

class DoricViewNode;
class DoricRootNode;

class DORIC_EXPORT DoricContext {
private:
  QString mContextId;
  QMap<QString, QObject *> mPluginMap;
  DoricRootNode *mRootNode;
  QString source;
  QString script;
  QString extra;
  QVariant initParams;
  DoricInterfaceDriver *driver = NULL;
  QQmlApplicationEngine *mQmlEngine;

  QMap<QString, QMap<QString, DoricViewNode *>> mHeadNodes;

public:
  DoricContext(QString contextId, QString source, QString extra);

  ~DoricContext();

  static DoricContext *create(QString script, QString source, QString extra);

  void init(QString initData);

  void build(int width, int height);

  std::shared_ptr<DoricAsyncResult> callEntity(QString methodName,
                                               QVariantList args);

  DoricInterfaceDriver *getDriver();

  DoricRootNode *getRootNode();

  QObject *obtainPlugin(QString name);

  void setQmlEngine(QQmlApplicationEngine *engine);

  QQmlApplicationEngine *getQmlEngine();

  DoricViewNode *targetViewNode(QString id);

  QString getContextId();

  QList<DoricViewNode *> allHeadNodes(QString type);

  void addHeadNode(QString type, DoricViewNode *viewNode);

  void removeHeadNode(QString type, DoricViewNode *viewNode);

  void clearHeadNodes(QString type);
};

#endif // CONTEXT_H
