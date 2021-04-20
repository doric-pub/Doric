#include "DoricRootNode.h"

void DoricRootNode::setRootView(QQuickItem *rootView) {
  this->mView = rootView;
  this->createLayouts(rootView);

  this->getLayouts()->setLayoutType(DoricLayoutType::DoricStack);
}

QQuickItem *DoricRootNode::getRootView() { return mView; }

void DoricRootNode::requestLayout() {
  getLayouts()->apply();
  DoricStackNode::requestLayout();
}
