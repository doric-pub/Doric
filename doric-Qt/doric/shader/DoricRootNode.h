#ifndef ROOTNODE_H
#define ROOTNODE_H

#include <QQuickItem>

#include "DoricStackNode.h"

class DoricRootNode : public DoricStackNode {
public:
  using DoricStackNode::DoricStackNode;

  void setRootView(QQuickItem *rootView);

  QQuickItem *getRootView();

  virtual void requestLayout() override;
};

#endif // ROOTNODE_H
