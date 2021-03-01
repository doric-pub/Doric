#ifndef FLEXLAYOUT_H
#define FLEXLAYOUT_H

#include <QJSValue>
#include <QObject>
#include <QVariant>
#include <QtDebug>

#include "yoga/Yoga.h"
#include "FlexLayoutConfig.h"

class FlexLayout : public QObject {
  Q_OBJECT

  Q_PROPERTY(int flexShrink READ getFlexShrink WRITE setFlexShrink)
  Q_PROPERTY(int flexGrow READ getFlexGrow WRITE setFlexGrow)

  Q_PROPERTY(int minHeight READ getHeight WRITE setHeight)
  Q_PROPERTY(int height READ getHeight WRITE setHeight)
  Q_PROPERTY(int minWidth READ getWidth WRITE setWidth)
  Q_PROPERTY(int width READ getWidth WRITE setWidth)

  Q_PROPERTY(int marginTop READ getMarginTop WRITE setMarginTop)
  Q_PROPERTY(int marginLeft READ getMarginLeft WRITE setMarginLeft)
  Q_PROPERTY(int marginRight READ getMarginRight WRITE setMarginRight)
  Q_PROPERTY(int marginBottom READ getMarginBottom WRITE setMarginBottom)

  Q_PROPERTY(int paddingTop READ getPaddingTop WRITE setPaddingTop)
  Q_PROPERTY(int paddingLeft READ getPaddingLeft WRITE setPaddingLeft)
  Q_PROPERTY(int paddingRight READ getPaddingRight WRITE setPaddingRight)
  Q_PROPERTY(int paddingBottom READ getPaddingBottom WRITE setPaddingBottom)

  Q_PROPERTY(int layoutTop READ getLayoutTop)
  Q_PROPERTY(int layoutLeft READ getLayoutLeft)
  Q_PROPERTY(int layoutRight READ getLayoutRight)
  Q_PROPERTY(int layoutBottom READ getLayoutBottom)

private:
  YGNodeRef node;
  FlexLayoutConfig *config;

public:
  FlexLayout(FlexLayoutConfig *config, QObject *parent = nullptr);
  virtual ~FlexLayout();
  YGNodeRef getNode();
public slots:
  /* child */
  Q_INVOKABLE void appendChildren(QVariant children);
  /* flex */
  int getFlexGrow();
  void setFlexGrow(int v);
  int getFlexShrink();
  void setFlexShrink(int v);
  /* height */
  int getHeight();
  void setHeight(int point);
  int getMinHeight();
  void setMinHeight(int point);
  /* width */
  int getWidth();
  void setWidth(int point);
  int getMinWidth();
  void setMinWidth(int point);
  /* display */
  Q_INVOKABLE void setDisplayNone();
  Q_INVOKABLE void setDisplayFlex();
  /* flex-direction */
  Q_INVOKABLE void setFlexDirectionRow();
  Q_INVOKABLE void setFlexDirectionRowReverse();
  Q_INVOKABLE void setFlexDirectionColumn();
  Q_INVOKABLE void setFlexDirectionColumnReverse();
  /* justify-content */
  Q_INVOKABLE void setJustifyCenter();
  Q_INVOKABLE void setJustifyFlexStart();
  Q_INVOKABLE void setJustifyFlexEnd();
  Q_INVOKABLE void setJustifySpaceAround();
  Q_INVOKABLE void setJustifySpaceEvenly();
  Q_INVOKABLE void setJustifySpaceBetween();
  /* align-content */
  Q_INVOKABLE void setAlignContentAuto();
  Q_INVOKABLE void setAlignContentCenter();
  Q_INVOKABLE void setAlignContentFlexEnd();
  Q_INVOKABLE void setAlignContentStretch();
  Q_INVOKABLE void setAlignContentBaseline();
  Q_INVOKABLE void setAlignContentFlexStart();
  Q_INVOKABLE void setAlignContentSpaceAround();
  Q_INVOKABLE void setAlignContentSpaceBetween();
  /* align-items */
  Q_INVOKABLE void setAlignItemsAuto();
  Q_INVOKABLE void setAlignItemsCenter();
  Q_INVOKABLE void setAlignItemsFlexEnd();
  Q_INVOKABLE void setAlignItemsStretch();
  Q_INVOKABLE void setAlignItemsBaseline();
  Q_INVOKABLE void setAlignItemsFlexStart();
  Q_INVOKABLE void setAlignItemsSpaceAround();
  Q_INVOKABLE void setAlignItemsSpaceBetween();
  /* align-self */
  Q_INVOKABLE void setAlignSelfAuto();
  Q_INVOKABLE void setAlignSelfCenter();
  Q_INVOKABLE void setAlignSelfFlexEnd();
  Q_INVOKABLE void setAlignSelfStretch();
  Q_INVOKABLE void setAlignSelfBaseline();
  Q_INVOKABLE void setAlignSelfFlexStart();
  Q_INVOKABLE void setAlignSelfSpaceAround();
  Q_INVOKABLE void setAlignSelfSpaceBetween();
  /* flex-wrap */
  Q_INVOKABLE void setWrap();
  Q_INVOKABLE void setNoWrap();
  Q_INVOKABLE void setWrapReverse();
  /* margin */
  int getMarginTop();
  void setMarginTop(int point);
  int getMarginLeft();
  void setMarginLeft(int point);
  int getMarginRight();
  void setMarginRight(int point);
  int getMarginBottom();
  void setMarginBottom(int point);
  /* padding */
  int getPaddingTop();
  void setPaddingTop(int point);
  int getPaddingLeft();
  void setPaddingLeft(int point);
  int getPaddingRight();
  void setPaddingRight(int point);
  int getPaddingBottom();
  void setPaddingBottom(int point);
  /* calculate */
  int getLayoutTop();
  int getLayoutLeft();
  int getLayoutRight();
  int getLayoutBottom();
  int getLayoutWidth();
  int getLayoutHeight();
  Q_INVOKABLE void calculateLayoutRtl(int width, int height);
  Q_INVOKABLE void calculateLayoutLtr(int width, int height);

private:
  static bool tryCast(QJSValue src, FlexLayout *&dst);
};
#endif // FLEXLAYOUT_H
