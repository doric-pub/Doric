#ifndef DORICDRAGGABLEBRIDGE_H
#define DORICDRAGGABLEBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricDraggableBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricDraggableBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onDrag(QString pointer, double x, double y);
};

#endif // DORICDRAGGABLEBRIDGE_H
