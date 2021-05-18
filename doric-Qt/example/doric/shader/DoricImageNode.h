#ifndef DORICIMAGENODE_H
#define DORICIMAGENODE_H

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricImageNode : public DoricViewNode {
public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blend(QJsonValue jsValue) override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  void onReady();

  void onError();

private:
  QString loadCallbackId = "";

  int contentMode = 0;

  int placeHolderColor = -1;

  int errorColor = -1;
};

#endif // DORICIMAGENODE_H
