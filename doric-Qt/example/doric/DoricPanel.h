#ifndef PANEL_H
#define PANEL_H

#include <QQuickItem>

#include "DoricExport.h"

#include "DoricContext.h"

class DORIC_EXPORT DoricPanel {
private:
  DoricContext *mContext;
  int renderedWidth = -1;
  int renderedHeight = -1;

  QQmlEngine *mQmlEngine;
  QQuickItem *mQuickItem;

public:
  DoricPanel(QQmlEngine *qmlEngine, QQuickItem *quickItem);

  ~DoricPanel();

  void config(QString script, QString alias, QString extra);

  void config(DoricContext *context);
};

#endif // PANEL_H
