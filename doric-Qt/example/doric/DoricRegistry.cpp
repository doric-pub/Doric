#include "DoricRegistry.h"
#include "DoricLibrary.h"

#include "plugin/DoricModalPlugin.h"
#include "plugin/DoricNavBarPlugin.h"
#include "plugin/DoricNavigatorPlugin.h"
#include "plugin/DoricNetworkPlugin.h"
#include "plugin/DoricNotificationPlugin.h"
#include "plugin/DoricPopoverPlugin.h"
#include "plugin/DoricShaderPlugin.h"
#include "plugin/DoricStoragePlugin.h"

#include "shader/DoricDraggableNode.h"
#include "shader/DoricFlexNode.h"
#include "shader/DoricHLayoutNode.h"
#include "shader/DoricImageNode.h"
#include "shader/DoricInputNode.h"
#include "shader/DoricRootNode.h"
#include "shader/DoricScrollerNode.h"
#include "shader/DoricStackNode.h"
#include "shader/DoricSwitchNode.h"
#include "shader/DoricTextNode.h"
#include "shader/DoricVLayoutNode.h"
#include "shader/list/DoricListItemNode.h"
#include "shader/list/DoricListNode.h"
#include "shader/slider/DoricSlideItemNode.h"
#include "shader/slider/DoricSliderNode.h"

DoricRegistry::DoricRegistry() {
  qDebug() << "DoricRegistry constructor";

  registerNativePlugin<DoricShaderPlugin>("shader");
  registerNativePlugin<DoricModalPlugin>("modal");
  registerNativePlugin<DoricPopoverPlugin>("popover");
  registerNativePlugin<DoricNetworkPlugin>("network");
  registerNativePlugin<DoricStoragePlugin>("storage");
  registerNativePlugin<DoricNotificationPlugin>("notification");
  registerNativePlugin<DoricNavigatorPlugin>("navigator");
  registerNativePlugin<DoricNavBarPlugin>("navbar");

  registerViewNode<DoricRootNode>("Root");
  registerViewNode<DoricStackNode>("Stack");
  registerViewNode<DoricVLayoutNode>("VLayout");
  registerViewNode<DoricHLayoutNode>("HLayout");
  registerViewNode<DoricTextNode>("Text");
  registerViewNode<DoricScrollerNode>("Scroller");
  registerViewNode<DoricImageNode>("Image");
  registerViewNode<DoricSliderNode>("Slider");
  registerViewNode<DoricSlideItemNode>("SlideItem");
  registerViewNode<DoricInputNode>("Input");
  registerViewNode<DoricSwitchNode>("Switch");
  registerViewNode<DoricDraggableNode>("Draggable");
  registerViewNode<DoricFlexNode>("FlexLayout");
  registerViewNode<DoricListNode>("List");
  registerViewNode<DoricListItemNode>("ListItem");
}

bool DoricRegistry::acquirePluginInfo(QString name) {
  return plugins.acquireClass(name);
}

bool DoricRegistry::acquireNodeInfo(QString name) {
  return nodes.acquireClass(name);
}

void DoricRegistry::registerLibrary(DoricLibrary *doricLibrary) {
  doricLibraries.insert(doricLibrary);
  doricLibrary->load(this);
}
