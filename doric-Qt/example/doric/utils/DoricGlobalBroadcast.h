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
};

#endif // DORICGLOBALBROADCAST_H
