#ifndef DEMOBRIDGE_H
#define DEMOBRIDGE_H

#include <QObject>
#include <QQmlApplicationEngine>

class DoricDemoBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricDemoBridge(QQmlApplicationEngine *engine,
                           QObject *parent = nullptr);

  Q_INVOKABLE
  void navigate(QVariant path, QVariant index);

private:
  QQmlApplicationEngine *mEngine;
};

#endif // DEMOBRIDGE_H
