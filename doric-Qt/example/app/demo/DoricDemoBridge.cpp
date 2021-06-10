#include <QDebug>
#include <QQmlContext>

#include "DoricDemoBridge.h"
#include "DoricPanel.h"
#include "loader/DoricJSLoaderManager.h"
#include "utils/DoricDialogBridge.h"
#include "utils/DoricDraggableBridge.h"
#include "utils/DoricImageBridge.h"
#include "utils/DoricInputBridge.h"
#include "utils/DoricMouseAreaBridge.h"
#include "utils/DoricSlideItemBridge.h"
#include "utils/DoricSliderBridge.h"
#include "utils/DoricSwitchBridge.h"
#include "utils/DoricUtils.h"

DoricDemoBridge::DoricDemoBridge(QQmlApplicationEngine *engine, QObject *parent)
    : QObject(parent) {
  this->mEngine = engine;

  auto context = mEngine->rootContext();
  DoricMouseAreaBridge *mouseAreaBridge = new DoricMouseAreaBridge();
  context->setContextProperty("mouseAreaBridge", mouseAreaBridge);
  DoricDialogBridge *dialogBridge = new DoricDialogBridge();
  context->setContextProperty("dialogBridge", dialogBridge);
  DoricImageBridge *imageBridge = new DoricImageBridge();
  context->setContextProperty("imageBridge", imageBridge);
  DoricInputBridge *inputBridge = new DoricInputBridge();
  context->setContextProperty("inputBridge", inputBridge);
  DoricSwitchBridge *switchBridge = new DoricSwitchBridge();
  context->setContextProperty("switchBridge", switchBridge);
  DoricSlideItemBridge *slideItemBridge = new DoricSlideItemBridge();
  context->setContextProperty("slideItemBridge", slideItemBridge);
  DoricSliderBridge *sliderBridge = new DoricSliderBridge();
  context->setContextProperty("sliderBridge", sliderBridge);
  DoricDraggableBridge *draggableBridge = new DoricDraggableBridge();
  context->setContextProperty("draggableBridge", draggableBridge);
}

void DoricDemoBridge::navigate(QVariant source, QVariant alias) {
  std::shared_ptr<DoricAsyncResult> asyncResult =
      DoricJSLoaderManager::getInstance()->request(source.toString());

  QString script = asyncResult->getResult();

  QQmlComponent component(mEngine);
  const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
  component.loadUrl(url);
  QObject *object = component.create();
  QQuickItem *quickItem = qobject_cast<QQuickItem *>(object);
  DoricPanel *panel = new DoricPanel(mEngine, quickItem);
  quickItem->setWidth(600);
  quickItem->setHeight(800);
  panel->config(script, alias.toString(), NULL);

  QObject *window = mEngine->rootObjects().at(0);
  QVariant arg = QVariant::fromValue(object);
  QMetaObject::invokeMethod(window, "navigatorPush", Q_ARG(QVariant, arg));
}
