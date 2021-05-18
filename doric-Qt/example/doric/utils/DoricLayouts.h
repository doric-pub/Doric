#ifndef DORICLAYOUTS_H
#define DORICLAYOUTS_H

#include <QQuickItem>

#include "DoricExport.h"

class DORIC_EXPORT DoricLayoutType {
public:
  const static int DoricUndefined = 0;
  const static int DoricStack = 1;
  const static int DoricVLayout = 2;
  const static int DoricHLayout = 3;
};

class DORIC_EXPORT DoricLayoutSpec {
public:
  const static int DoricLayoutJust = 0;
  const static int DoricLayoutFit = 1;
  const static int DoricLayoutMost = 2;
};

class DORIC_EXPORT DoricGravity {
public:
  const static int DoricGravitySpecified = 1;
  const static int DoricGravityStart = 1 << 1;
  const static int DoricGravityEnd = 1 << 2;
  const static int DoricGravityShiftX = 0;
  const static int DoricGravityShiftY = 4;
  const static int DoricGravityLeft =
      (DoricGravityStart | DoricGravitySpecified) << DoricGravityShiftX;
  const static int DoricGravityRight = (DoricGravityEnd | DoricGravitySpecified)
                                       << DoricGravityShiftX;
  const static int DoricGravityTop = (DoricGravityStart | DoricGravitySpecified)
                                     << DoricGravityShiftY;
  const static int DoricGravityBottom =
      (DoricGravityEnd | DoricGravitySpecified) << DoricGravityShiftY;
  const static int DoricGravityCenterX = DoricGravitySpecified
                                         << DoricGravityShiftX;
  const static int DoricGravityCenterY = DoricGravitySpecified
                                         << DoricGravityShiftY;
  const static int DoricGravityCenter =
      DoricGravityCenterX | DoricGravityCenterY;
};

class DORIC_EXPORT DoricLayouts : public QObject {
public:
  explicit DoricLayouts(QObject *parent = nullptr);

  void setWidthSpec(int widthSpec);
  void setHeightSpec(int heightSpec);

  void setAlignment(int alignment);

  void setGravity(int gravity);

  void setWidth(qreal width);
  void setHeight(qreal height);

  void setSpacing(qreal spacing);

  void setMarginLeft(qreal marginLeft);
  void setMarginTop(qreal marginTop);
  void setMarginRight(qreal marginRight);
  void setMarginBottom(qreal marginBottom);

  void setPaddingLeft(qreal paddingLeft);
  void setPaddingTop(qreal paddingTop);
  void setPaddingRight(qreal paddingRight);
  void setPaddingBottom(qreal paddingBottom);

  void setWeight(int weight);

  void setView(QQuickItem *view);

  void setLayoutType(int layoutType);

  void setDisabled(bool disabled);

  void setMaxWidth(qreal maxWidth);
  void setMaxHeight(qreal maxHeight);
  void setMinWidth(qreal minWidth);
  void setMinHeight(qreal minHeight);

  void apply(QSizeF frameSize);

  void apply();

  qreal getMeasuredWidth();
  qreal getMeasuredHeight();

private:
  QString tag;

  int widthSpec;
  int heightSpec;

  int alignment;

  int gravity;

  qreal width;
  qreal height;

  qreal spacing;

  qreal marginLeft;
  qreal marginTop;
  qreal marginRight;
  qreal marginBottom;

  qreal paddingLeft;
  qreal paddingTop;
  qreal paddingRight;
  qreal paddingBottom;

  int weight;

  QQuickItem *view;

  int layoutType;

  bool disabled;

  qreal maxWidth;
  qreal maxHeight;
  qreal minWidth;
  qreal minHeight;

  bool resolved;

  qreal measuredWidth;
  void setMeasuredWidth(qreal measuredWidth);
  qreal measuredHeight;
  void setMeasuredHeight(qreal measuredHeight);
  qreal measuredX;
  void setMeasuredX(qreal measuredX);
  qreal measuredY;
  void setMeasuredY(qreal measuredY);

  bool undefined;

  //
  qreal contentWidth;
  qreal contentHeight;

  void measure(QSizeF targetSize);

  void measureSelf(QSizeF targetSize);

  void measureContent(QSizeF targetSize);

  void measureUndefinedContent(QSizeF targetSize);
  void measureStackContent(QSizeF targetSize);
  void measureVLayoutContent(QSizeF targetSize);
  void measureHLayoutContent(QSizeF targetSize);

  qreal takenWidth();
  qreal takenHeight();
  QSizeF removeMargin(QSizeF targetSize);

  bool restrainSize();

  void layout();

  void layoutStack();
  void layoutVLayout();
  void layoutHLayout();

  void setFrame();
};

#endif // DORICLAYOUTS_H
