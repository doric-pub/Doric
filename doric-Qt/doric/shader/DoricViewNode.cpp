#include "DoricViewNode.h"
#include "../utils/DoricUtils.h"
#include "DoricSuperNode.h"

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

void DoricViewNode::blend(QJSValue jsValue) { qDebug() << jsValue.toString(); }
