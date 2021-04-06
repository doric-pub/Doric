#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QJsonObject>
#include <QJsonValue>
#include <QQuickItem>

#include "../utils/DoricContextHolder.h"

class SpecMode {
public:
  const static int JUST = 0;
  const static int FIT = 1;
  const static int MOST = 2;
};

class DoricSuperNode;

class DoricViewNode : public DoricContextHolder {

protected:
  QQuickItem *mView;

  DoricSuperNode *mSuperNode = nullptr;

  virtual QQuickItem *build() = 0;

  void setLayoutConfig(QJsonValue layoutConfig);

private:
  QString mId;

  QJsonValue mLayoutConfig;

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

  virtual void blend(QJsonValue jsValue);

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop);

  virtual void blendLayoutConfig(QJsonValue jsObject);

  void onClick();

  void callJSResponse(QString funcId, QVariantList args);
};
#endif // DORICVIEWNODE_H
