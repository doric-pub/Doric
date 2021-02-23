#ifndef PANEL_H
#define PANEL_H

#include <QQuickItem>

#include "DoricContext.h"

class DoricPanel {
private:
  DoricContext *mContext;
  int renderedWidth = -1;
  int renderedHeight = -1;

  QQmlEngine *mQmlEngine;
  QQuickItem *mQuickItem;

public:
  DoricPanel(QQmlEngine *qmlEngine, QQuickItem *quickItem);

  void config(QString script, QString alias, QString extra);

  void config(DoricContext *context);
};

#endif // PANEL_H
