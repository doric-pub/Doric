#include "DoricPanel.h"
#include "shader/DoricRootNode.h"

DoricPanel::DoricPanel(QQuickItem *quickItem) { mQuickItem = quickItem; }

void DoricPanel::config(QString script, QString alias, QString extra) {
  DoricContext *context = DoricContext::create(script, alias, extra);
  config(context);
}

void DoricPanel::config(DoricContext *context) {
  this->mContext = context;
  this->mContext->getRootNode()->setRootView(mQuickItem);
  this->mContext->build(mQuickItem->width(), mQuickItem->height());
}
