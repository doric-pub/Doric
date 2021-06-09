#include <QDebug>
#include <QQmlContext>

#include "DoricDemoBridge.h"
#include "DoricPanel.h"
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

void DoricDemoBridge::navigate(QVariant route) {
  QString name;
  switch (route.toInt()) {
  case 0:
    name = "ComponetDemo.js";
    break;
  case 1:
    name = "Counter.js";
    break;
  case 2:
    name = "DraggableDemo.js";
    break;
  case 3:
    name = "EffectsDemo.js";
    break;
  case 4:
    name = "FlexDemo.js";
    break;
  case 5:
    name = "Gobang.js";
    break;
  case 6:
    name = "ImageDemo.js";
    break;
  case 7:
    name = "InputDemo.js";
    break;
  case 8:
    name = "LayoutDemo.js";
    break;
  case 9:
    name = "LayoutTestDemo.js";
    break;
  case 10:
    name = "ModalDemo.js";
    break;
  case 11:
    name = "ModularDemo.js";
    break;
  case 12:
    name = "NavigatorDemo.js";
    break;
  case 13:
    name = "NetworkDemo.js";
    break;
  case 14:
    name = "NotificationDemo.js";
    break;
  case 15:
    name = "PopoverDemo.js";
    break;
  case 16:
    name = "ScrollerDemo.js";
    break;
  case 17:
    name = "SimpleDemo.js";
    break;
  case 18:
    name = "SliderDemo.js";
    break;
  case 19:
    name = "Snake.js";
    break;
  case 20:
    name = "StorageDemo.js";
    break;
  case 21:
    name = "SwitchDemo.js";
    break;
  case 22:
    name = "TextDemo.js";
    break;
  }
  QString script = DoricUtils::readAssetFile("/doric/bundles", name);

  QQmlComponent component(mEngine);
  const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
  component.loadUrl(url);
  QObject *object = component.create();
  QQuickItem *quickItem = qobject_cast<QQuickItem *>(object);
  DoricPanel *panel = new DoricPanel(mEngine, quickItem);
  quickItem->setWidth(600);
  quickItem->setHeight(800);
  panel->config(script, name, NULL);

  QObject *window = mEngine->rootObjects().at(0);
  QVariant arg = QVariant::fromValue(object);
  QMetaObject::invokeMethod(window, "navigatorPush", Q_ARG(QVariant, arg));
}
