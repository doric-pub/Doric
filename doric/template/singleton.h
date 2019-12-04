#ifndef SINGLETON_H
#define SINGLETON_H

#include <QDebug>

class Singleton
{
private:
    static Singleton *local_instance;
    Singleton() {
        qDebug() << "constructor";
    }

    ~Singleton() {
        qDebug() << "destructor";
    }

public:
    static Singleton *getInstance() {
        static Singleton locla_s;
        return &locla_s;
    }
};

#endif // SINGLETON_H
