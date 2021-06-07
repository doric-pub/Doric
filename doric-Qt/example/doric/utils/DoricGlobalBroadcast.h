#ifndef DORICGLOBALBROADCAST_H
#define DORICGLOBALBROADCAST_H

#include <QDebug>

class DoricGlobalBroadcast {
private:
  static DoricGlobalBroadcast *local_instance;
  DoricGlobalBroadcast() { qDebug() << "DoricGlobalBroadcast constructor"; }

  ~DoricGlobalBroadcast() { qDebug() << "DoricGlobalBroadcast destructor"; }

public:
  static DoricGlobalBroadcast *getInstance() {
    static DoricGlobalBroadcast instance;
    return &instance;
  }

  QString subscribe(QString name, std::function<void(QString)> callback);

  void unsubscribe(QString subscribeId);

  void publish(QString name, QString data);

private:
  QAtomicInt idGenerator;

  QMap<QString, QList<QPair<QString, std::function<void(QString)>>>> subjects;
};

#endif // DORICGLOBALBROADCAST_H
