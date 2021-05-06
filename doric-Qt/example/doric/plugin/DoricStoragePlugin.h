#ifndef DORICSTORAGEPLUGIN_H
#define DORICSTORAGEPLUGIN_H

#include "DoricNativePlugin.h"

class DoricStoragePlugin : public DoricNativePlugin {
  Q_OBJECT
private:
  static const QString PREF_NAME;

public:
  using DoricNativePlugin::DoricNativePlugin;

  Q_INVOKABLE void setItem(QString jsValueString, QString callbackId);

  Q_INVOKABLE void getItem(QString jsValueString, QString callbackId);

  Q_INVOKABLE void remove(QString jsValueString, QString callbackId);

  Q_INVOKABLE void clear(QString jsValueString, QString callbackId);
};

#endif // DORICSTORAGEPLUGIN_H
