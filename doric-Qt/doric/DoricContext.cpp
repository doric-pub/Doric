#include "DoricContext.h"
#include "DoricContextManager.h"
#include "DoricNativeDriver.h"

#include "utils/DoricConstant.h"
#include "utils/DoricContextHolder.h"

DoricContext::DoricContext(QString contextId, QString source, QString extra) {
  this->mRootNode = new DoricRootNode();

  this->mContextId = contextId;
  this->source = source;
  this->extra = extra;
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

QObject *DoricContext::obtainPlugin(QString name) {
  if (mPluginMap.keys().contains(name)) {
    return mPluginMap.value(name);
  } else {
    QObject *plugin =
        getDriver()->getRegistry()->pluginInfoMap.createObject(name);
    dynamic_cast<DoricContextHolder *>(plugin)->setContext(this);
    mPluginMap.insert(name, plugin);
    return plugin;
  }
}
