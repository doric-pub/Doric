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
  QMap<QString, QJSValue> values;
  while (it.hasNext()) {
    it.next();
    values.insert(it.name(), it.value());
  }

  auto keys = values.keys();
  for (const QString &key : keys) {
    qCritical() << key << ": " << values.value(key).toString();
    qCritical() << mView;
    blend(mView, key, values.value(key));
  }
}

void DoricViewNode::blend(QQuickItem *view, QString name, QJSValue prop) {
  qCritical() << "view node blend";
  if (name == "width") {

  } else if (name == "height") {
  }
}
