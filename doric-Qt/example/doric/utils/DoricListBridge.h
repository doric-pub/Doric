#ifndef DORICLISTBRIDGE_H
#define DORICLISTBRIDGE_H

#include <QObject>
#include <QVariant>

#include "DoricExport.h"

class DORIC_EXPORT DoricListBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricListBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void bind(QString pointer, QVariant rectangle, int position);
};

#endif // DORICLISTBRIDGE_H
