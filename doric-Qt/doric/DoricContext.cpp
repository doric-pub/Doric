#include "DoricContext.h"
#include "DoricContextManager.h"
#include "DoricNativeDriver.h"

#include "shader/DoricRootNode.h"
#include "utils/DoricConstant.h"
#include "utils/DoricContextHolder.h"

DoricContext::DoricContext(QString contextId, QString source, QString extra) {
  this->mRootNode = new DoricRootNode();
  this->mRootNode->setContext(this);

  this->mContextId = contextId;
  this->source = source;
  this->extra = extra;
}

DoricContext::~DoricContext() {
  QVariantList args;
  callEntity(DoricConstant::DORIC_ENTITY_DESTROY, args);
  DoricContextManager::getInstance()->destroyContext(this);
}

DoricContext *DoricContext::create(QString script, QString source,
                                   QString extra) {
  DoricContext *context =
      DoricContextManager::getInstance()->createContext(script, source, extra);
  context->script = script;
  context->init(extra);

  QVariantList args;
  context->callEntity(DoricConstant::DORIC_ENTITY_CREATE, args);
  return context;
}

void DoricContext::init(QString initData) {
  this->extra = initData;
  if (!initData.isEmpty()) {
    QVariantList args;
    args.push_back(initData);
    callEntity(DoricConstant::DORIC_ENTITY_INIT, args);
  }
}

void DoricContext::build(int width, int height) {
  QMap<QString, QVariant> map;
  map.insert("width", QVariant(width));
  map.insert("height", QVariant(height));
  QVariant jsValue(map);
  this->initParams = jsValue;

  QVariantList args;
  args.push_back(this->initParams);
  callEntity(DoricConstant::DORIC_ENTITY_BUILD, args);
}

void DoricContext::callEntity(QString methodName, QVariantList args) {
  return getDriver()->invokeContextEntityMethod(this->mContextId, methodName,
                                                args);
}

DoricInterfaceDriver *DoricContext::getDriver() {
  if (driver == NULL) {
    driver = DoricNativeDriver::getInstance();
    return driver;
  }
  return driver;
}

DoricRootNode *DoricContext::getRootNode() { return mRootNode; }

QObject *DoricContext::obtainPlugin(QString name) {
  if (mPluginMap.keys().contains(name)) {
    return mPluginMap.value(name);
  } else {
    QObject *plugin = getDriver()->getRegistry()->plugins.createObject(name);
    dynamic_cast<DoricContextHolder *>(plugin)->setContext(this);
    mPluginMap.insert(name, plugin);
    return plugin;
  }
}

void DoricContext::setQmlEngine(QQmlEngine *engine) { mQmlEngine = engine; }

QQmlEngine *DoricContext::getQmlEngine() { return mQmlEngine; }

DoricViewNode *DoricContext::targetViewNode(QString id) {
  if (id == mRootNode->getId()) {
    return mRootNode;
  }
  return nullptr;
}

QString DoricContext::getContextId() { return mContextId; }

QList<DoricViewNode *> DoricContext::allHeadNodes(QString type) {
  return mHeadNodes[type].values();
}

void DoricContext::addHeadNode(QString type, DoricViewNode *viewNode) {
  if (mHeadNodes.contains(type)) {
    QMap<QString, DoricViewNode *> map = mHeadNodes[type];
    map.insert(viewNode->getId(), viewNode);
  } else {
    QMap<QString, DoricViewNode *> map;
    map.insert(viewNode->getId(), viewNode);
    mHeadNodes.insert(type, map);
  }
}

void DoricContext::removeHeadNode(QString type, DoricViewNode *viewNode) {
  if (mHeadNodes.contains(type)) {
    QMap<QString, DoricViewNode *> map = mHeadNodes[type];
    map.remove(viewNode->getId());
  }
}

void DoricContext::clearHeadNodes(QString type) {
  if (mHeadNodes.contains(type)) {
    QMap<QString, DoricViewNode *> map = mHeadNodes[type];
    map.clear();
  }
}
