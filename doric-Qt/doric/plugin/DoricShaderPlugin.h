#ifndef SHADERPLUGIN_H
#define SHADERPLUGIN_H

#include <QJSValue>
#include <QObject>

class DoricShaderPlugin : public QObject {
  Q_OBJECT
public:
  DoricShaderPlugin(QObject *parent);

  Q_INVOKABLE void render(QJSValue jsValue, QString callbackId);
};

#endif // SHADERPLUGIN_H
