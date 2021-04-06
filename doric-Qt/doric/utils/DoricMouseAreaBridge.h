#ifndef DORICMOUSEAREABRIDGE_H
#define DORICMOUSEAREABRIDGE_H

#include <QObject>
#include <QVariant>

class DoricMouseAreaBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricMouseAreaBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onClick(QString pointer);
signals:
};

#endif // DORICMOUSEAREABRIDGE_H
