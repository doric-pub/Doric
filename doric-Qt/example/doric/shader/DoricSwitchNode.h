#ifndef DORICSWITCHNODE_H
#define DORICSWITCHNODE_H

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricSwitchNode : public DoricViewNode {

private:
  bool checkByCodeToggle = false;

  QString onSwitchFuncId;

public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  void onSwitch(bool checked);
};

#endif // DORICSWITCHNODE_H
