#ifndef DORICLAYOUT_H
#define DORICLAYOUT_H

#include <QQuickItem>

enum DoricLayoutType {
  DoricUndefined = 0,
  DoricStack = 1,
  DoricVLayout = 2,
  DoricHLayout = 3,
};

enum DoricLayoutSpec {
  DoricLayoutJust = 0,
  DoricLayoutFit = 1,
  DoricLayoutMost = 2,
};

enum DoricGravity {
  DoricGravitySpecified = 1,
  DoricGravityStart = 1 << 1,
  DoricGravityEnd = 1 << 2,
  DoricGravityShiftX = 0,
  DoricGravityShiftY = 4,
  DoricGravityLeft = (DoricGravityStart | DoricGravitySpecified)
                     << DoricGravityShiftX,
  DoricGravityRight = (DoricGravityEnd | DoricGravitySpecified)
                      << DoricGravityShiftX,
  DoricGravityTop = (DoricGravityStart | DoricGravitySpecified)
                    << DoricGravityShiftY,
  DoricGravityBottom = (DoricGravityEnd | DoricGravitySpecified)
                       << DoricGravityShiftY,
  DoricGravityCenterX = DoricGravitySpecified << DoricGravityShiftX,
  DoricGravityCenterY = DoricGravitySpecified << DoricGravityShiftY,
  DoricGravityCenter = DoricGravityCenterX | DoricGravityCenterY,
};

class DoricLayout : public QObject {
  Q_OBJECT
public:
  DoricLayoutSpec widthSpec;
  DoricLayoutSpec heightSpec;
  DoricGravity alignment;
  DoricGravity gravity;
  int width;
  int height;
  int marginLeft;
  int marginTop;
  int marginRight;
  int marginBottom;
  int paddingLeft;
  int paddingTop;
  int paddingRight;
  int paddingBottom;

  int weight;

  QQuickItem *view;

  DoricLayoutType layoutType;
  bool disabled;
  int maxWidth;
  int maxHeight;
  int minWidth;
  int minHeight;

  bool resolved;
  int measuredWidth;
  int measuredHeight;
  int measuredX;
  int measuredY;

  bool undefined;

  DoricLayout(QObject *parent = nullptr) : QObject(parent) {
    widthSpec = DoricLayoutJust;
    heightSpec = DoricLayoutJust;
    maxWidth = INT_MAX;
    maxHeight = INT_MAX;
    minWidth = INT_MIN;
    minHeight = INT_MIN;
  }

  void measure(int targetSizeWidth, int targetSizeHeight);

  void apply();

  void apply(int frameSizeWidth, int frameSizeHeight);

  int contentWidth;
  int contentHeight;
};

#endif // DORICLAYOUT_H
