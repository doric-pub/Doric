#ifndef DORICDIALOGBRIDGE_H
#define DORICDIALOGBRIDGE_H

#include <QObject>

class DoricDialogBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricDialogBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onAccepted(QString windowPointer, QString pluginPointer,
                  QString callbackId);

  Q_INVOKABLE
  void onAcceptedWithInput(QString windowPointer, QString pluginPointer,
                           QString callbackId, QString input);

  Q_INVOKABLE
  void onRejected(QString windowPointer, QString pluginPointer,
                  QString callbackId);

  Q_INVOKABLE
  void onRejectedWithInput(QString windowPointer, QString pluginPointer,
                           QString callbackId, QString input);
};

#endif // DORICDIALOGBRIDGE_H
