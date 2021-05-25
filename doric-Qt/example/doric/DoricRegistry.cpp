#include "DoricRegistry.h"
#include "DoricLibrary.h"

#include "plugin/DoricModalPlugin.h"
#include "plugin/DoricNetworkPlugin.h"
#include "plugin/DoricPopoverPlugin.h"
#include "plugin/DoricShaderPlugin.h"
#include "plugin/DoricStoragePlugin.h"

#include "shader/DoricHLayoutNode.h"
#include "shader/DoricImageNode.h"
#include "shader/DoricInputNode.h"
#include "shader/DoricRootNode.h"
#include "shader/DoricScrollerNode.h"
#include "shader/DoricStackNode.h"
#include "shader/DoricTextNode.h"
#include "shader/DoricVLayoutNode.h"
#include "shader/slider/DoricSlideItemNode.h"
#include "shader/slider/DoricSliderNode.h"

DoricRegistry::DoricRegistry() {
  registerNativePlugin<DoricShaderPlugin>("shader");
  registerNativePlugin<DoricModalPlugin>("modal");
  registerNativePlugin<DoricPopoverPlugin>("popover");
  registerNativePlugin<DoricNetworkPlugin>("network");
  registerNativePlugin<DoricStoragePlugin>("storage");

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
