#include <QDebug>
#include <QQmlContext>
#include <QQuickView>

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

DoricDemoBridge::DoricDemoBridge(QObject *parent) : QObject(parent) {}

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

  QQuickView *view = new QQuickView();
  {
    const QUrl url(QStringLiteral("qrc:/doric/qml/view.qml"));
    view->setSource(url);
    view->setWidth(600);
    view->setHeight(800);
    Qt::WindowFlags flag = Qt::Dialog | Qt::MSWindowsFixedSizeDialogHint |
                           Qt::WindowTitleHint | Qt::WindowCloseButtonHint |
                           Qt::CustomizeWindowHint | Qt::WindowSystemMenuHint;
    view->setFlags(flag);
  }

  {
    QQmlComponent component(view->engine());
    const QUrl url(QStringLiteral("qrc:/doric/qml/panel.qml"));
    component.loadUrl(url);
    QQuickItem *quickItem = qobject_cast<QQuickItem *>(component.create());
    DoricPanel *panel = new DoricPanel(view->engine(), quickItem);
    quickItem->setWidth(600);
    quickItem->setHeight(800);
    quickItem->setParentItem(view->rootObject());

    panel->config(script, name, NULL);

    connect(view, &QQuickView::visibleChanged, this, [view, panel]() {
      if (!view->isVisible()) {
        delete panel;
      }
    });
  }

  view->show();

  auto context = view->engine()->rootContext();
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
