#include "FlexLayout.h"

FlexLayout::FlexLayout(FlexLayoutConfig *config, QObject *parent)
    : QObject(parent) {
  node = YGNodeNewWithConfig(config->getConfig());
  this->config = config;
}

FlexLayout::~FlexLayout() { YGNodeFree(node); }

YGNodeRef FlexLayout::getNode() { return node; }

void FlexLayout::appendChildren(QVariant children) {
  QJSValue child = qvariant_cast<QJSValue>(children);
  std::vector<YGNodeRef> tmp;
  if (child.isUndefined()) {
    qCritical() << "FlexLayout appendChildren child undefined";
  } else if (!child.isArray()) {
    qCritical() << "FlexLayout appendChildren child is not array";
  } else {
    const int length = child.property("length").toInt();
    for (int i = 0; i != length; i++) {
      FlexLayout *node = nullptr;
      if (!tryCast(child.property(i), node)) {
        qCritical() << "FlexLayout appendChildren child is not qobject";
        return;
      } else {
        node->setParent(this);
        tmp.push_back(node->getNode());
      }
    }
    YGNodeSetChildren(this->node, tmp);
  }
}

int FlexLayout::getFlexGrow() {
  return static_cast<int>(YGNodeStyleGetFlexGrow(node));
}

void FlexLayout::setFlexGrow(int v) {
  YGNodeStyleSetFlexGrow(node, static_cast<float>(v));
}

int FlexLayout::getFlexShrink() {
  return static_cast<int>(YGNodeStyleGetFlexShrink(node));
}

void FlexLayout::setFlexShrink(int v) {
  YGNodeStyleSetFlexShrink(node, static_cast<float>(v));
}

int FlexLayout::getHeight() {
  return static_cast<int>(YGNodeStyleGetHeight(node).value);
}

void FlexLayout::setHeight(int points) {
  YGNodeStyleSetHeight(node, static_cast<float>(points));
}

int FlexLayout::getMinHeight() {
  return static_cast<int>(YGNodeStyleGetMinHeight(node).value);
}

void FlexLayout::setMinHeight(int point) {
  YGNodeStyleSetMinHeight(node, static_cast<float>(point));
}

int FlexLayout::getWidth() {
  return static_cast<int>(YGNodeStyleGetWidth(node).value);
}

void FlexLayout::setWidth(int points) {
  YGNodeStyleSetWidth(node, static_cast<float>(points));
}

int FlexLayout::getMinWidth() {
  return static_cast<int>(YGNodeStyleGetMinWidth(node).value);
}

void FlexLayout::setMinWidth(int point) {
  YGNodeStyleSetMinWidth(node, static_cast<float>(point));
}

void FlexLayout::setDisplayNone() {
  YGNodeStyleSetDisplay(node, YGDisplayNone);
}

void FlexLayout::setDisplayFlex() {
  YGNodeStyleSetDisplay(node, YGDisplayFlex);
}

void FlexLayout::setFlexDirectionRow() {
  YGNodeStyleSetFlexDirection(node, YGFlexDirectionRow);
}

void FlexLayout::setFlexDirectionRowReverse() {
  YGNodeStyleSetFlexDirection(node, YGFlexDirectionRowReverse);
}

void FlexLayout::setFlexDirectionColumn() {
  YGNodeStyleSetFlexDirection(node, YGFlexDirectionColumn);
}

void FlexLayout::setFlexDirectionColumnReverse() {
  YGNodeStyleSetFlexDirection(node, YGFlexDirectionColumnReverse);
}

void FlexLayout::setJustifyCenter() {
  YGNodeStyleSetJustifyContent(node, YGJustifyCenter);
}

void FlexLayout::setJustifyFlexStart() {
  YGNodeStyleSetJustifyContent(node, YGJustifyFlexStart);
}

void FlexLayout::setJustifyFlexEnd() {
  YGNodeStyleSetJustifyContent(node, YGJustifyFlexEnd);
}

void FlexLayout::setJustifySpaceAround() {
  YGNodeStyleSetJustifyContent(node, YGJustifySpaceAround);
}

void FlexLayout::setJustifySpaceEvenly() {
  YGNodeStyleSetJustifyContent(node, YGJustifySpaceEvenly);
}

void FlexLayout::setJustifySpaceBetween() {
  YGNodeStyleSetJustifyContent(node, YGJustifySpaceBetween);
}

void FlexLayout::setAlignContentAuto() {
  YGNodeStyleSetAlignContent(node, YGAlignAuto);
}

void FlexLayout::setAlignContentCenter() {
  YGNodeStyleSetAlignContent(node, YGAlignCenter);
}

void FlexLayout::setAlignContentFlexEnd() {
  YGNodeStyleSetAlignContent(node, YGAlignFlexEnd);
}

void FlexLayout::setAlignContentStretch() {
  YGNodeStyleSetAlignContent(node, YGAlignStretch);
}

void FlexLayout::setAlignContentBaseline() {
  YGNodeStyleSetAlignContent(node, YGAlignBaseline);
}

void FlexLayout::setAlignContentFlexStart() {
  YGNodeStyleSetAlignContent(node, YGAlignFlexStart);
}

void FlexLayout::setAlignContentSpaceAround() {
  YGNodeStyleSetAlignContent(node, YGAlignSpaceAround);
}

void FlexLayout::setAlignContentSpaceBetween() {
  YGNodeStyleSetAlignContent(node, YGAlignSpaceBetween);
}

void FlexLayout::setAlignItemsAuto() {
  YGNodeStyleSetAlignItems(node, YGAlignAuto);
}

void FlexLayout::setAlignItemsCenter() {
  YGNodeStyleSetAlignItems(node, YGAlignCenter);
}

void FlexLayout::setAlignItemsFlexEnd() {
  YGNodeStyleSetAlignItems(node, YGAlignFlexEnd);
}

void FlexLayout::setAlignItemsStretch() {
  YGNodeStyleSetAlignItems(node, YGAlignStretch);
}

void FlexLayout::setAlignItemsBaseline() {
  YGNodeStyleSetAlignItems(node, YGAlignBaseline);
}

void FlexLayout::setAlignItemsFlexStart() {
  YGNodeStyleSetAlignItems(node, YGAlignFlexStart);
}

void FlexLayout::setAlignItemsSpaceAround() {
  YGNodeStyleSetAlignItems(node, YGAlignSpaceAround);
}

void FlexLayout::setAlignItemsSpaceBetween() {
  YGNodeStyleSetAlignItems(node, YGAlignSpaceBetween);
}

void FlexLayout::setAlignSelfAuto() {
  YGNodeStyleSetAlignSelf(node, YGAlignAuto);
}

void FlexLayout::setAlignSelfCenter() {
  YGNodeStyleSetAlignSelf(node, YGAlignCenter);
}

void FlexLayout::setAlignSelfFlexEnd() {
  YGNodeStyleSetAlignSelf(node, YGAlignFlexEnd);
}

void FlexLayout::setAlignSelfStretch() {
  YGNodeStyleSetAlignSelf(node, YGAlignStretch);
}

void FlexLayout::setAlignSelfBaseline() {
  YGNodeStyleSetAlignSelf(node, YGAlignBaseline);
}

void FlexLayout::setAlignSelfFlexStart() {
  YGNodeStyleSetAlignSelf(node, YGAlignFlexStart);
}

void FlexLayout::setAlignSelfSpaceAround() {
  YGNodeStyleSetAlignSelf(node, YGAlignSpaceAround);
}

void FlexLayout::setAlignSelfSpaceBetween() {
  YGNodeStyleSetAlignSelf(node, YGAlignSpaceBetween);
}

void FlexLayout::setWrap() { YGNodeStyleSetFlexWrap(node, YGWrapWrap); }

void FlexLayout::setNoWrap() { YGNodeStyleSetFlexWrap(node, YGWrapNoWrap); }

void FlexLayout::setWrapReverse() {
  YGNodeStyleSetFlexWrap(node, YGWrapWrapReverse);
}

int FlexLayout::getMarginTop() {
  return static_cast<int>(YGNodeStyleGetMargin(node, YGEdgeTop).value);
}

void FlexLayout::setMarginTop(int point) {
  YGNodeStyleSetMargin(node, YGEdgeTop, static_cast<float>(point));
}

int FlexLayout::getMarginLeft() {
  return static_cast<int>(YGNodeStyleGetMargin(node, YGEdgeLeft).value);
}

void FlexLayout::setMarginLeft(int point) {
  YGNodeStyleSetMargin(node, YGEdgeLeft, static_cast<float>(point));
}

int FlexLayout::getMarginRight() {
  return static_cast<int>(YGNodeStyleGetMargin(node, YGEdgeRight).value);
}

void FlexLayout::setMarginRight(int point) {
  YGNodeStyleSetMargin(node, YGEdgeRight, static_cast<float>(point));
}

int FlexLayout::getMarginBottom() {
  return static_cast<int>(YGNodeStyleGetMargin(node, YGEdgeBottom).value);
}

void FlexLayout::setMarginBottom(int point) {
  YGNodeStyleSetMargin(node, YGEdgeBottom, static_cast<float>(point));
}

int FlexLayout::getPaddingTop() {
  return static_cast<int>(YGNodeStyleGetPadding(node, YGEdgeTop).value);
}

void FlexLayout::setPaddingTop(int point) {
  YGNodeStyleSetPadding(node, YGEdgeTop, static_cast<float>(point));
}

int FlexLayout::getPaddingLeft() {
  return static_cast<int>(YGNodeStyleGetPadding(node, YGEdgeLeft).value);
}

void FlexLayout::setPaddingLeft(int point) {
  YGNodeStyleSetPadding(node, YGEdgeLeft, static_cast<float>(point));
}

int FlexLayout::getPaddingRight() {
  return static_cast<int>(YGNodeStyleGetPadding(node, YGEdgeRight).value);
}

void FlexLayout::setPaddingRight(int point) {
  YGNodeStyleSetPadding(node, YGEdgeRight, static_cast<float>(point));
}

int FlexLayout::getPaddingBottom() {
  return static_cast<int>(YGNodeStyleGetPadding(node, YGEdgeBottom).value);
}

void FlexLayout::setPaddingBottom(int point) {
  YGNodeStyleSetPadding(node, YGEdgeBottom, static_cast<float>(point));
}

int FlexLayout::getLayoutTop() {
  return static_cast<int>(YGNodeLayoutGetTop(node));
}

int FlexLayout::getLayoutLeft() {
  return static_cast<int>(YGNodeLayoutGetLeft(node));
}

int FlexLayout::getLayoutRight() {
  return static_cast<int>(YGNodeLayoutGetRight(node));
}

int FlexLayout::getLayoutBottom() {
  return static_cast<int>(YGNodeLayoutGetBottom(node));
}

int FlexLayout::getLayoutWidth() {
  return static_cast<int>(YGNodeLayoutGetWidth(node));
}

int FlexLayout::getLayoutHeight() {
  return static_cast<int>(YGNodeLayoutGetHeight(node));
}

void FlexLayout::calculateLayoutRtl(int width, int height) {
  YGNodeCalculateLayout(node, static_cast<float>(width),
                        static_cast<float>(height), YGDirectionRTL);
}

void FlexLayout::calculateLayoutLtr(int width, int height) {
  YGNodeCalculateLayout(node, static_cast<float>(width),
                        static_cast<float>(height), YGDirectionLTR);
}

bool FlexLayout::tryCast(QJSValue src, FlexLayout *&dst) {
  if (!src.isQObject()) {
    return false;
  } else {
    dst = qobject_cast<FlexLayout *>(src.toQObject());
    return dst != nullptr;
  }
}
