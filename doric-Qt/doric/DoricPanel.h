#ifndef PANEL_H
#define PANEL_H

#include <QQuickItem>

#include "DoricContext.h"

class DoricPanel {
private:
  DoricContext *mContext;
  int renderedWidth = -1;
  int renderedHeight = -1;

  QQuickItem *mQuickItem;

public:
  DoricPanel(QQuickItem *quickItem);

  void config(QString script, QString alias, QString extra);

  void config(DoricContext *context);
};

#endif // PANEL_H
