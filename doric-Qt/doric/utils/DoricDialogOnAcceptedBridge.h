#ifndef DORICDIALOGONACCEPTEDBRIDGE_H
#define DORICDIALOGONACCEPTEDBRIDGE_H

#include <QObject>

class DoricDialogOnAcceptedBridge : public QObject {
  Q_OBJECT
public:
  explicit DoricDialogOnAcceptedBridge(QObject *parent = nullptr);

  Q_INVOKABLE
  void onClick(QString windowPointer, QString pluginPointer,
               QString callbackId);
};

#endif // DORICDIALOGONACCEPTEDBRIDGE_H
