#ifndef DEMOBRIDGE_H
#define DEMOBRIDGE_H

#include <QObject>
#include <QVariant>

class DoricDemoBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricDemoBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void navigate(QVariant route);
signals:
};

#endif // DEMOBRIDGE_H
