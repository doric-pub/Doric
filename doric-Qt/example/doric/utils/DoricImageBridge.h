#ifndef DORICIMAGEBRIDGE_H
#define DORICIMAGEBRIDGE_H

#include <QObject>

class DoricImageBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricImageBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onNull(QString pointer);

  Q_INVOKABLE
  void onReady(QString pointer);

  Q_INVOKABLE
  void onLoading(QString pointer);

  Q_INVOKABLE
  void onError(QString pointer);
};

#endif // DORICIMAGEBRIDGE_H
