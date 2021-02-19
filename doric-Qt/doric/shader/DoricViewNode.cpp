#include <QJSValueIterator>

#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"
#include "DoricViewNode.h"

void DoricViewNode::blendLayoutConfig() {}

void DoricViewNode::setLayoutConfig(QJSValue layoutConfig) {}

void DoricViewNode::init(DoricSuperNode *superNode) {
  if (DoricUtils:: instanceof <DoricSuperNode *>(this)) {
    DoricSuperNode *thiz = dynamic_cast<DoricSuperNode *>(this);
    thiz->mReusable = superNode->mReusable;
  }
  this->mSuperNode = superNode;
  this->mView = build();
}

QString DoricViewNode::getId() { return mId; }

void DoricViewNode::setId(QString id) { mId = id; }

void DoricViewNode::blend(QJSValue jsValue) {
  QJSValueIterator it(jsValue);
  while (it.hasNext()) {
    it.next();
    qDebug() << it.name() << ": " << it.value().toString();
    blend(mView, it.name(), it.value());
  }
}

void DoricViewNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  if (name == "width") {

  } else if (name == "height") {
  }
}
