#include "DoricContextHolder.h"

DoricContextHolder::DoricContextHolder(QObject *parent) { mContext = NULL; }

void DoricContextHolder::setContext(DoricContext *context) {
  mContext = context;
}

DoricContext *DoricContextHolder::getContext() { return mContext; }
