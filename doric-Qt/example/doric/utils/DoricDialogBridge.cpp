#include "DoricDialogBridge.h"
#include "plugin/DoricModalPlugin.h"

#include <QQuickWindow>

DoricDialogBridge::DoricDialogBridge(QObject *parent) : QObject(parent) {}

void DoricDialogBridge::onAccepted(QString windowPointer, QString pluginPointer,
                                   QString callbackId) {
  {
    QObject *object = (QObject *)(windowPointer.toULongLong());
    QQuickWindow *window = dynamic_cast<QQuickWindow *>(object);
    window->deleteLater();
  }

  {
    QObject *object = (QObject *)(pluginPointer.toULongLong());
    DoricModalPlugin *modalPlugin = dynamic_cast<DoricModalPlugin *>(object);
    modalPlugin->onAccepted(callbackId);
  }
}

void DoricDialogBridge::onRejected(QString windowPointer, QString pluginPointer,
                                   QString callbackId) {
  {
    QObject *object = (QObject *)(windowPointer.toULongLong());
    QQuickWindow *window = dynamic_cast<QQuickWindow *>(object);
    window->deleteLater();
  }

  {
    QObject *object = (QObject *)(pluginPointer.toULongLong());
    DoricModalPlugin *modalPlugin = dynamic_cast<DoricModalPlugin *>(object);
    modalPlugin->onRejected(callbackId);
  }
}

void DoricDialogBridge::onAcceptedWithInput(QString windowPointer,
                                            QString pluginPointer,
                                            QString callbackId, QString input) {
  {
    QObject *object = (QObject *)(windowPointer.toULongLong());
    QQuickWindow *window = dynamic_cast<QQuickWindow *>(object);
    window->deleteLater();
  }

  {
    QObject *object = (QObject *)(pluginPointer.toULongLong());
    DoricModalPlugin *modalPlugin = dynamic_cast<DoricModalPlugin *>(object);
    modalPlugin->onAcceptedWithInput(callbackId, input);
  }
}

void DoricDialogBridge::onRejectedWithInput(QString windowPointer,
                                            QString pluginPointer,
                                            QString callbackId, QString input) {
  {
    QObject *object = (QObject *)(windowPointer.toULongLong());
    QQuickWindow *window = dynamic_cast<QQuickWindow *>(object);
    window->deleteLater();
  }

  {
    QObject *object = (QObject *)(pluginPointer.toULongLong());
    DoricModalPlugin *modalPlugin = dynamic_cast<DoricModalPlugin *>(object);
    modalPlugin->onRejectedWithInput(callbackId, input);
  }
}
