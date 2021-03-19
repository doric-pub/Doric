#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QQuickItem>

#include "../utils/DoricContextHolder.h"

class DoricSuperNode;

class DoricViewNode : public DoricContextHolder {

protected:
  QQuickItem *mView;

  DoricSuperNode *mSuperNode;

  virtual QQuickItem *build() = 0;

  void setLayoutConfig(QJSValue layoutConfig);

private:
  QString mId;

  QJSValue mLayoutConfig;

  QList<QString> getIdList();

  QString clickFunction;

public:
  QString mType;

  using DoricContextHolder::DoricContextHolder;

  void init(DoricSuperNode *superNode);

  static DoricViewNode *create(DoricContext *context, QString type) {
    bool classRegistered =
        context->getDriver()->getRegistry()->acquireNodeInfo(type);
    if (classRegistered) {
      QObject *node =
          context->getDriver()->getRegistry()->nodes.createObject(type);
      DoricViewNode *castNode = dynamic_cast<DoricViewNode *>(node);
      castNode->setContext(context);
      castNode->mType = type;
      return castNode;
    } else {
      return nullptr;
    }
  }

  QString getId();

  void setId(QString id);

  QString getType();

  QQuickItem *getNodeView();

  virtual void blend(QJSValue jsValue);

  virtual void blend(QQuickItem *view, QString name, QJSValue prop);

  virtual void blendLayoutConfig(QJSValue jsObject);

  void onClick();

  void callJSResponse(QString funcId, QVariantList args);
};
#endif // DORICVIEWNODE_H
