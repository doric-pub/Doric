#include <QByteArray>
#include <QHash>
#include <QMetaObject>

#ifndef OBJECTFACTORY_H
#define OBJECTFACTORY_H

class DoricObjectFactory {
public:
  template <typename T> static void registerClass(QString name) {
    constructors().insert(name, &constructorHelper<T>);
  }

  static bool acquireClass(QString name) {
    return constructors().keys().contains(name);
  }

  static QObject *createObject(const QString &name, QObject *parent = NULL) {
    Constructor constructor = constructors().value(name);
    if (constructor == NULL)
      return NULL;
    return (*constructor)(parent);
  }

private:
  typedef QObject *(*Constructor)(QObject *parent);

  template <typename T> static QObject *constructorHelper(QObject *parent) {
    return new T(parent);
  }

  static QHash<QString, Constructor> &constructors() {
    static QHash<QString, Constructor> instance;
    return instance;
  }
};

#endif // OBJECTFACTORY_H
