#include "DoricDialogOnAcceptedBridge.h"
#include "plugin/DoricModalPlugin.h"

#include <QQuickWindow>

DoricDialogOnAcceptedBridge::DoricDialogOnAcceptedBridge(QObject *parent)
    : QObject(parent) {}

void DoricDialogOnAcceptedBridge::onClick(QString windowPointer,
                                          QString pluginPointer,
                                          QString callbackId) {
  {
    QObject *object = (QObject *)(windowPointer.toULongLong());
    QQuickWindow *window = dynamic_cast<QQuickWindow *>(object);
    window->deleteLater();
  }

  {
    QObject *object = (QObject *)(pluginPointer.toULongLong());
    DoricModalPlugin *modalPlugin = dynamic_cast<DoricModalPlugin *>(object);
    modalPlugin->onAccept(callbackId);
  }
}
