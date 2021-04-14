#ifndef DORICLAYOUTS_H
#define DORICLAYOUTS_H

#include <QQuickItem>

class DoricLayoutType {
public:
  const static int DoricUndefined = 0;
  const static int DoricStack = 1;
  const static int DoricVLayout = 2;
  const static int DoricHLayout = 3;
};

class DoricLayoutSpec {
public:
  const static int DoricLayoutJust = 0;
  const static int DoricLayoutFit = 1;
  const static int DoricLayoutMost = 2;
};

class DoricGravity {
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

class DoricLayouts : public QObject {
public:
  explicit DoricLayouts(QObject *parent = nullptr);

  void setWidthSpec(int widthSpec);
  void setHeightSpec(int heightSpec);

  void setAlignment(int alignment);

  void setGravity(int gravity);

  void setWidth(int width);
  void setHeight(int height);

  void setSpacing(int spacing);

  void setMarginLeft(int marginLeft);
  void setMarginTop(int marginTop);
  void setMarginRight(int marginRight);
  void setMarginBottom(int marginBottom);

  void setPaddingLeft(int paddingLeft);
  void setPaddingTop(int paddingTop);
  void setPaddingRight(int paddingRight);
  void setPaddingBottom(int paddingBottom);

  void setWeight(int weight);

  void setView(QQuickItem *view);

  void setLayoutType(int layoutType);

  void setDisabled(bool disabled);

  void setMaxWidth(int maxWidth);
  void setMaxHeight(int maxHeight);
  void setMinWidth(int minWidth);
  void setMinHeight(int minHeight);

  void apply(int targetWidth, int targetHeight);

  void apply();

  void measure(int targetWidth, int targetHeight);

  void measureSelf(int targetWidth, int targetHeight);

  void measureContent(int targetWidth, int targetHeight);

  void measureUndefinedContent(int targetWidth, int targetHeight);
  void measureStackContent(int targetWidth, int targetHeight);
  void measureVLayoutContent(int targetWidth, int targetHeight);
  void measureHLayoutContent(int targetWidth, int targetHeight);

  int takenWidth();
  int takenHeight();
  QPair<int, int> removeMargin(int targetWidth, int targetHeight);

  bool restrainSize();

  void layout();

  void layoutStack();
  void layoutVLayout();
  void layoutHLayout();

  void setFrame();

private:
  QString tag;

  int widthSpec;
  int heightSpec;

  int alignment;

  int gravity;

  int width;
  int height;

  int spacing;

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

  int layoutType;

  bool disabled;

  int maxWidth;
  int maxHeight;
  int minWidth;
  int minHeight;

  bool resolved;

  int measuredWidth;
  void setMeasuredWidth(int measuredWidth);
  int measuredHeight;
  void setMeasuredHeight(int measuredHeight);
  int measuredX;
  int measuredY;

  bool undefined;

  //
  int contentWidth;
  int contentHeight;
};

#endif // DORICLAYOUTS_H
