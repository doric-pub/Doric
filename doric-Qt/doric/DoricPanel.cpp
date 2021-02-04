#include "DoricPanel.h"

DoricPanel::DoricPanel() {}

void DoricPanel::config(QString script, QString alias, QString extra) {
  DoricContext *context = DoricContext::create(script, alias, extra);
  config(context);
}

void DoricPanel::config(DoricContext *context) {
  this->mContext = context;
  this->mContext->build(960, 720);
}
