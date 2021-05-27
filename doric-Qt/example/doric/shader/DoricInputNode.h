#ifndef DORICINPUTNODE_H
#define DORICINPUTNODE_H

#include "DoricExport.h"

#include "DoricViewNode.h"

class DORIC_EXPORT DoricInputNode : public DoricViewNode {
private:
  QString onTextChangeId;
  QString onFocusChangeId;

public:
  using DoricViewNode::DoricViewNode;

  QQuickItem *build() override;

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop) override;

  QSizeF sizeThatFits(QSizeF size);

  void onTextChange(QString text);

  void onFocusChange(bool hasFocus);
};

#endif // DORICINPUTNODE_H
