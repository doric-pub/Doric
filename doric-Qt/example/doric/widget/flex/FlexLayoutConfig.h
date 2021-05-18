#ifndef FLEXLAYOUTCONFIG_H
#define FLEXLAYOUTCONFIG_H

#include <QObject>
#include <QtDebug>

#include "DoricExport.h"

#include "yoga/Yoga.h"

class DORIC_EXPORT FlexLayoutConfig : public QObject {
  Q_OBJECT
private:
  YGConfigRef config;

public:
  explicit FlexLayoutConfig(QObject *parent = nullptr);
  virtual ~FlexLayoutConfig();
  YGConfigRef getConfig() const;
};

#endif // FLEXLAYOUTCONFIG_H
