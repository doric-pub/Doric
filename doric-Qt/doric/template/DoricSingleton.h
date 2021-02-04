#ifndef SINGLETON_H
#define SINGLETON_H

#include <QDebug>

class DoricSingleton {
private:
  static DoricSingleton *local_instance;
  DoricSingleton() { qDebug() << "constructor"; }

  ~DoricSingleton() { qDebug() << "destructor"; }

public:
  static DoricSingleton *getInstance() {
    static DoricSingleton locla_s;
    return &locla_s;
  }
};

#endif // SINGLETON_H
