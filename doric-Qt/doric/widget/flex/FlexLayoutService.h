#ifndef FLEXLAYOUTSERVICE_H
#define FLEXLAYOUTSERVICE_H

#include <QObject>
#include <QQmlContext>
#include <QVariant>
#include <QtDebug>

#include "FlexLayoutConfig.h"
#include "FlexLayout.h"

#include "yoga/Yoga.h"

class FlexLayoutService : public QObject {
  Q_OBJECT
private:
  FlexLayoutConfig *config;

public:
  explicit FlexLayoutService(QObject *parent = nullptr);
  virtual ~FlexLayoutService();
public slots:
  QVariant createConfig();
  QVariant createNode();
  QVariant createNode(QVariant config);
  void collectGarbage(QVariant rootNode);
};

#endif // FLEXLAYOUTSERVICE_H
