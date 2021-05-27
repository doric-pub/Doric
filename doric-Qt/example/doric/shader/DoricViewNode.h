#ifndef DORICVIEWNODE_H
#define DORICVIEWNODE_H

#include <QJsonObject>
#include <QJsonValue>
#include <QQuickItem>

#include "DoricExport.h"

#include "../utils/DoricContextHolder.h"
#include "../utils/DoricLayouts.h"

class DoricSuperNode;

class DORIC_EXPORT DoricViewNode : public DoricContextHolder {

protected:
  QQuickItem *mView;

  DoricLayouts *mLayouts = nullptr;

  virtual QQuickItem *build() = 0;

  void createLayouts(QQuickItem *view);

  DoricLayouts *getLayouts();

  void setLayoutConfig(QJsonValue layoutConfig);

private:
  QString mId;

  QList<QString> getIdList();

  QString clickFunction;

public:
  QString mType;

  DoricSuperNode *mSuperNode = nullptr;

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
      qCritical() << "DoricViewNode create error: " + type;
      return nullptr;
    }
  }

  QString getId();

  void setId(QString id);

  QString getType();

  QQuickItem *getNodeView();

  virtual void blend(QJsonValue jsValue);

  virtual void blend(QQuickItem *view, QString name, QJsonValue prop);

  virtual void afterBlended(QJsonValue prop);

  virtual void blendLayoutConfig(QJsonValue jsObject);

  virtual void requestLayout();

  void onClick();

  std::shared_ptr<DoricAsyncResult> callJSResponse(QString funcId,
                                                   QVariantList args);

  std::shared_ptr<DoricAsyncResult> pureCallJSResponse(QString funcId,
                                                       QVariantList args);

  QSizeF sizeThatFits(QSizeF size);
};
#endif // DORICVIEWNODE_H
