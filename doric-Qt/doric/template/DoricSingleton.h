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
    static DoricSingleton instance;
    return &instance;
  }
};

#endif // SINGLETON_H
