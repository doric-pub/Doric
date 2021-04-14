#include "DoricLayouts.h"

DoricLayouts::DoricLayouts(QObject *parent) : QObject(parent) {
  this->widthSpec = DoricLayoutSpec::DoricLayoutJust;
  this->heightSpec = DoricLayoutSpec::DoricLayoutJust;

  this->alignment = 0;
  this->gravity = 0;

  this->width = 0;
  this->height = 0;

  this->spacing = 0;

  this->marginBottom = 0;
  this->marginTop = 0;
  this->marginLeft = 0;
  this->marginRight = 0;

  this->paddingLeft = 0;
  this->paddingRight = 0;
  this->paddingBottom = 0;
  this->paddingTop = 0;

  this->weight = 0;

  this->layoutType = DoricLayoutType::DoricUndefined;

  this->disabled = false;

  this->maxWidth = INT_MAX;
  this->maxHeight = INT_MAX;
  this->minWidth = 0;
  this->minHeight = 0;

  this->measuredWidth = 0;
  this->measuredHeight = 0;

  this->measuredX = 0;
  this->measuredY = 0;

  this->undefined = false;

  this->contentWidth = 0;
  this->contentHeight = 0;
}

void DoricLayouts::setWidthSpec(int widthSpec) { this->widthSpec = widthSpec; }
void DoricLayouts::setHeightSpec(int heightSpec) {
  this->heightSpec = heightSpec;
}

void DoricLayouts::setAlignment(int alignment) { this->alignment = alignment; }

void DoricLayouts::setGravity(int gravity) { this->gravity = gravity; }

void DoricLayouts::setWidth(int width) { this->width = width; }
void DoricLayouts::setHeight(int height) { this->height = height; }

void DoricLayouts::setSpacing(int spacing) { this->spacing = spacing; }

void DoricLayouts::setMarginLeft(int marginLeft) {
  this->marginLeft = marginLeft;
}
void DoricLayouts::setMarginTop(int marginTop) { this->marginTop = marginTop; }
void DoricLayouts::setMarginRight(int marginRight) {
  this->marginRight = marginRight;
}
void DoricLayouts::setMarginBottom(int marginBottom) {
  this->marginBottom = marginBottom;
}

void DoricLayouts::setPaddingLeft(int paddingLeft) {
  this->paddingLeft = paddingLeft;
}
void DoricLayouts::setPaddingTop(int paddingTop) {
  this->paddingTop = paddingTop;
}
void DoricLayouts::setPaddingRight(int paddingRight) {
  this->paddingRight = paddingRight;
}
void DoricLayouts::setPaddingBottom(int paddingBottom) {
  this->paddingBottom = paddingBottom;
}

void DoricLayouts::setWeight(int weight) { this->weight = weight; }

void DoricLayouts::setView(QQuickItem *view) {
  this->view = view;
  this->setParent(view);
  this->tag = view->property("tag").toString();
}

void DoricLayouts::setLayoutType(int layoutType) {
  this->layoutType = layoutType;
}

void DoricLayouts::setDisabled(bool disabled) { this->disabled = disabled; }

void DoricLayouts::setMaxWidth(int maxWidth) { this->maxWidth = maxWidth; }
void DoricLayouts::setMaxHeight(int maxHeight) { this->maxHeight = maxHeight; }
void DoricLayouts::setMinWidth(int minWidth) { this->minWidth = minWidth; }
void DoricLayouts::setMinHeight(int minHeight) { this->minHeight = minHeight; }

void DoricLayouts::apply(int targetWidth, int targetHeight) {
  this->resolved = false;

  this->measure(targetWidth, targetHeight);
  this->setFrame();

  this->resolved = true;
}

void DoricLayouts::apply() {
  this->apply(this->view->width(), this->view->height());
}

void DoricLayouts::measure(int targetWidth, int targetHeight) {
  this->measureSelf(targetWidth, targetHeight);
  this->layout();
}

void DoricLayouts::measureSelf(int targetWidth, int targetHeight) {
  // measure width
  int width;
  if (this->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
    QQuickItem *parent = this->view->parentItem();
    DoricLayouts *parentDoricLayout =
        (DoricLayouts *)(parent->property("doricLayout").toULongLong());
    if (parentDoricLayout->layoutType == DoricLayoutType::DoricHLayout &&
        this->weight > 0) {
      width = 0;
      setMeasuredWidth(0);
    } else {
      width = targetWidth;
      setMeasuredWidth(targetWidth);
    }
  } else if (this->widthSpec == DoricLayoutSpec::DoricLayoutJust) {
    width = this->width;
    setMeasuredWidth(this->width);
  } else {
    width = targetWidth;
  }

  // measure height
  int height;
  if (this->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
    QQuickItem *parent = this->view->parentItem();
    DoricLayouts *parentDoricLayout =
        (DoricLayouts *)(parent->property("doricLayout").toULongLong());
    if (parentDoricLayout->layoutType == DoricLayoutType::DoricVLayout &&
        this->weight > 0) {
      height = 0;
      setMeasuredHeight(0);
    } else {
      height = targetHeight;
      setMeasuredHeight(targetHeight);
    }
  } else if (this->heightSpec == DoricLayoutSpec::DoricLayoutJust) {
    height = this->height;
    setMeasuredHeight(this->height);
  } else {
    height = targetHeight;
  }

  // measure content

  this->measureContent(width - this->paddingLeft - this->paddingRight,
                       height - this->paddingTop - this->paddingBottom);

  if (this->restrainSize()) {
    this->measureContent(
        this->measuredWidth - this->paddingLeft - this->paddingRight,
        this->measuredHeight - this->paddingTop - this->paddingBottom);
  }
  this->restrainSize();
}

void DoricLayouts::measureContent(int targetWidth, int targetHeight) {
  qCritical() << "measureContent: " << tag << this->view->property("uuid");
  switch (this->layoutType) {
  case DoricLayoutType::DoricStack: {
    this->measureStackContent(targetWidth, targetHeight);
    break;
  }
  case DoricLayoutType::DoricVLayout: {
    this->measureVLayoutContent(targetWidth, targetHeight);
    break;
  }
  case DoricLayoutType::DoricHLayout: {
    this->measureHLayoutContent(targetWidth, targetHeight);
    break;
  }
  default: {
    this->measureUndefinedContent(targetWidth, targetHeight);
    break;
  }
  }

  QQuickItem *parent = this->view->parentItem();
  DoricLayouts *parentDoricLayout =
      (DoricLayouts *)(parent->property("doricLayout").toULongLong());
  if (parentDoricLayout != nullptr) {
    if (parentDoricLayout->layoutType != DoricLayoutType::DoricUndefined &&
        parentDoricLayout->widthSpec == DoricLayoutSpec::DoricLayoutFit &&
        this->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
      setMeasuredWidth(0);
    }
    if (parentDoricLayout->layoutType != DoricLayoutType::DoricUndefined &&
        parentDoricLayout->heightSpec == DoricLayoutSpec::DoricLayoutFit &&
        this->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
      setMeasuredHeight(0);
    }
  }
}

void DoricLayouts::measureUndefinedContent(int targetWidth, int targetHeight) {
  int width = this->view->width();
  int height = this->view->height();

  if (width > targetWidth) {
    width = targetWidth;
  }
  if (height > targetHeight) {
    height = targetHeight;
  }
  if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredWidth(width + this->paddingLeft + this->paddingRight);
  }
  if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredHeight(height + this->paddingTop + this->paddingBottom);
  }
}
void DoricLayouts::measureStackContent(int targetWidth, int targetHeight) {
  int contentWidth = 0, contentHeight = 0;
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }

    QPair<int, int> size = layout->removeMargin(targetWidth, targetHeight);
    layout->measure(size.first, size.second);
    contentWidth = qMax(contentWidth, layout->takenWidth());
    contentHeight = qMax(contentHeight, layout->takenHeight());
  }
  if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredWidth(contentWidth + this->paddingLeft + this->paddingRight);
  }

  if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredHeight(contentHeight + this->paddingTop + this->paddingBottom);
  }

  this->contentWidth = contentWidth;
  this->contentHeight = contentHeight;
}
void DoricLayouts::measureVLayoutContent(int targetWidth, int targetHeight) {
  int contentWidth = 0, contentHeight = 0, contentWeight = 0;
  bool had = false;
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }
    had = true;

    QPair<int, int> pair =
        layout->removeMargin(targetWidth, targetHeight - contentHeight);
    layout->measure(pair.first, pair.second);
    contentWidth = qMax(contentWidth, layout->takenWidth());
    contentHeight += layout->takenHeight() + this->spacing;
    contentWeight += layout->weight;
  }

  if (had) {
    contentHeight -= this->spacing;
  }

  if (contentWeight > 0) {
    int remaining = targetHeight - contentHeight;
    contentWidth = 0;
    foreach (QQuickItem *subview, this->view->childItems()) {
      DoricLayouts *layout =
          (DoricLayouts *)(subview->property("doricLayout").toULongLong());
      if (layout == nullptr) {
        continue;
      }

      if (layout->disabled) {
        continue;
      }
      int measuredHeight =
          layout->measuredHeight + remaining / contentWeight * layout->weight;
      layout->measuredHeight = measuredHeight;
      // Need Remeasure
      layout->measureContent(
          layout->measuredWidth - layout->paddingLeft - layout->paddingRight,
          measuredHeight - layout->paddingTop - layout->paddingBottom);
      layout->measuredHeight = measuredHeight;
      contentWidth = qMax(contentWidth, layout->takenWidth());
    }
    contentHeight = targetHeight;
  }

  if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredWidth(contentWidth + this->paddingLeft + this->paddingRight);
  }

  if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredHeight(contentHeight + this->paddingTop + this->paddingBottom);
  }

  this->contentWidth = contentWidth;
  this->contentHeight = contentHeight;
}
void DoricLayouts::measureHLayoutContent(int targetWidth, int targetHeight) {
  int contentWidth = 0, contentHeight = 0, contentWeight = 0;
  bool had = false;
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }
    had = true;
    QPair<int, int> pair =
        layout->removeMargin(targetWidth - contentWidth, targetHeight);
    layout->measure(pair.first, pair.second);
    contentWidth += layout->takenWidth() + this->spacing;
    contentHeight = qMax(contentHeight, layout->takenHeight());
    contentWeight += layout->weight;
  }

  if (had) {
    contentWidth -= this->spacing;
  }

  if (contentWeight > 0) {
    int remaining = targetWidth - contentWidth;
    contentHeight = 0;
    foreach (QQuickItem *subview, this->view->childItems()) {
      DoricLayouts *layout =
          (DoricLayouts *)(subview->property("doricLayout").toULongLong());
      if (layout == nullptr) {
        continue;
      }

      if (layout->disabled) {
        continue;
      }
      int measuredWidth =
          layout->measuredWidth + remaining / contentWeight * layout->weight;
      layout->measuredWidth = measuredWidth;
      // Need Remeasure
      layout->measureContent(
          measuredWidth - layout->paddingLeft - layout->paddingRight,
          layout->measuredHeight - layout->paddingTop - layout->paddingBottom);
      layout->measuredWidth = measuredWidth;
      contentHeight = qMax(contentHeight, layout->takenHeight());
    }
    contentWidth = targetWidth;
  }

  if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredWidth(contentWidth + this->paddingLeft + this->paddingRight);
  }

  if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredHeight(contentHeight + this->paddingTop + this->paddingBottom);
  }

  this->contentWidth = contentWidth;
  this->contentHeight = contentHeight;
}

int DoricLayouts::takenWidth() {
  return this->measuredWidth + this->marginLeft + this->marginRight;
}
int DoricLayouts::takenHeight() {
  return this->measuredHeight + this->marginTop + this->marginBottom;
}
QPair<int, int> DoricLayouts::removeMargin(int targetWidth, int targetHeight) {
  QPair<int, int> pair(targetWidth - this->marginLeft - this->marginRight,
                       targetHeight - this->marginTop - this->marginBottom);
  return pair;
}

bool DoricLayouts::restrainSize() {
  bool needRemeasure = false;
  if (this->measuredWidth > this->maxWidth) {
    setMeasuredWidth(this->maxWidth);
    needRemeasure = true;
  }
  if (this->measuredHeight > this->maxHeight) {
    setMeasuredHeight(this->maxHeight);
    needRemeasure = true;
  }
  if (this->measuredWidth < this->minWidth) {
    setMeasuredWidth(this->minWidth);
    needRemeasure = true;
  }
  if (this->measuredHeight < this->minHeight) {
    setMeasuredHeight(this->minHeight);
    needRemeasure = true;
  }
  return needRemeasure;
}

void DoricLayouts::layout() {
  switch (this->layoutType) {
  case DoricLayoutType::DoricStack: {
    this->layoutStack();
    break;
  }
  case DoricLayoutType::DoricVLayout: {
    this->layoutVLayout();
    break;
  }
  case DoricLayoutType::DoricHLayout: {
    this->layoutHLayout();
    break;
  }
  default: {
    break;
  }
  }
}

void DoricLayouts::setFrame() {
  if (this->layoutType != DoricLayoutType::DoricUndefined) {
    foreach (QQuickItem *subview, this->view->childItems()) {
      DoricLayouts *layout =
          (DoricLayouts *)(subview->property("doricLayout").toULongLong());
      if (layout == nullptr) {
        continue;
      }

      layout->setFrame();
    }
  }

  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredWidth: " << this->measuredWidth
              << " measuredHeight: " << this->measuredHeight
              << " measuredX: " << this->measuredX
              << " measuredY: " << this->measuredY;

  this->view->setProperty("width", this->measuredWidth);
  this->view->setProperty("height", this->measuredHeight);
  this->view->setProperty("x", this->measuredX);
  this->view->setProperty("y", this->measuredY);
}

void DoricLayouts::layoutStack() {
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }
    if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredWidth =
          this->measuredWidth - layout->marginLeft - layout->marginRight;
    }
    if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredHeight =
          this->measuredHeight - layout->marginTop - layout->marginBottom;
    }
    layout->layout();

    int gravity = layout->alignment;
    if ((gravity & DoricGravity::DoricGravityLeft) ==
        DoricGravity::DoricGravityLeft) {
      layout->measuredX = this->paddingLeft;
    } else if ((gravity & DoricGravity::DoricGravityRight) ==
               DoricGravity::DoricGravityRight) {
      layout->measuredX =
          this->measuredWidth - this->paddingRight - layout->measuredWidth;
    } else if ((gravity & DoricGravity::DoricGravityCenterX) ==
               DoricGravity::DoricGravityCenterX) {
      layout->measuredX = this->measuredWidth / 2 - layout->measuredWidth / 2;
    } else {
      if (layout->marginLeft || layout->marginRight) {
        layout->measuredX = this->paddingLeft;
      } else {
        layout->measuredX = 0;
      }
    }

    if ((gravity & DoricGravity::DoricGravityTop) ==
        DoricGravity::DoricGravityTop) {
      layout->measuredY = this->paddingTop;
    } else if ((gravity & DoricGravity::DoricGravityBottom) ==
               DoricGravity::DoricGravityBottom) {
      layout->measuredY =
          this->measuredHeight - this->paddingBottom - layout->measuredHeight;
    } else if ((gravity & DoricGravity::DoricGravityCenterY) ==
               DoricGravity::DoricGravityCenterY) {
      layout->measuredY = this->measuredHeight / 2 - layout->measuredHeight / 2;
    } else {
      if (layout->marginTop || layout->marginBottom) {
        layout->measuredY = this->paddingTop;
      } else {
        layout->measuredY = 0;
      }
    }

    if (!gravity) {
      gravity = DoricGravity::DoricGravityLeft | DoricGravity::DoricGravityTop;
    }
    if (layout->marginLeft && !((gravity & DoricGravity::DoricGravityRight) ==
                                DoricGravity::DoricGravityRight)) {
      layout->measuredX += layout->marginLeft;
    }
    if (layout->marginRight && !((gravity & DoricGravity::DoricGravityLeft) ==
                                 DoricGravity::DoricGravityLeft)) {
      layout->measuredX -= layout->marginRight;
    }
    if (layout->marginTop && !((gravity & DoricGravity::DoricGravityBottom) ==
                               DoricGravity::DoricGravityBottom)) {
      layout->measuredY += layout->marginTop;
    }
    if (layout->marginBottom && !((gravity & DoricGravity::DoricGravityTop) ==
                                  DoricGravity::DoricGravityTop)) {
      layout->measuredY -= layout->marginBottom;
    }
  }
}

void DoricLayouts::layoutVLayout() {
  int yStart = this->paddingTop;
  if ((this->gravity & DoricGravity::DoricGravityTop) ==
      DoricGravity::DoricGravityTop) {
    yStart = this->paddingTop;
  } else if ((this->gravity & DoricGravity::DoricGravityBottom) ==
             DoricGravity::DoricGravityBottom) {
    yStart = this->measuredHeight - this->contentHeight - this->paddingBottom;
  } else if ((this->gravity & DoricGravity::DoricGravityCenterY) ==
             DoricGravity::DoricGravityCenterY) {
    yStart = (this->measuredHeight - this->contentHeight - this->paddingTop -
              this->paddingBottom) /
                 2 +
             this->paddingTop;
  }

  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }
    if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredWidth =
          this->measuredWidth - layout->marginLeft - layout->marginRight;
    }
    if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredHeight = this->measuredHeight - yStart -
                               layout->marginTop - layout->marginBottom;
    }
    layout->layout();
    int gravity = layout->alignment | this->gravity;
    if ((gravity & DoricGravity::DoricGravityLeft) ==
        DoricGravity::DoricGravityLeft) {
      layout->measuredX = this->paddingLeft;
    } else if ((gravity & DoricGravity::DoricGravityRight) ==
               DoricGravity::DoricGravityRight) {
      layout->measuredX =
          this->measuredWidth - this->paddingRight - layout->measuredWidth;
    } else if ((gravity & DoricGravity::DoricGravityCenterX) ==
               DoricGravity::DoricGravityCenterX) {
      layout->measuredX = this->measuredWidth / 2 - layout->measuredWidth / 2;
    } else {
      layout->measuredX = this->paddingLeft;
    }
    if (!gravity) {
      gravity = DoricGravity::DoricGravityLeft;
    }
    if (layout->marginLeft && !((gravity & DoricGravity::DoricGravityRight) ==
                                DoricGravity::DoricGravityRight)) {
      layout->measuredX += layout->marginLeft;
    }
    if (layout->marginRight && !((gravity & DoricGravity::DoricGravityLeft) ==
                                 DoricGravity::DoricGravityLeft)) {
      layout->measuredX -= layout->marginRight;
    }
    layout->measuredY = yStart + layout->marginTop;
    yStart += this->spacing + layout->takenHeight();
  }
}

void DoricLayouts::layoutHLayout() {
  int xStart = this->paddingLeft;
  if ((this->gravity & DoricGravity::DoricGravityLeft) ==
      DoricGravity::DoricGravityLeft) {
    xStart = this->paddingLeft;
  } else if ((this->gravity & DoricGravity::DoricGravityRight) ==
             DoricGravity::DoricGravityRight) {
    xStart = this->measuredWidth - this->contentWidth - this->paddingRight;
  } else if ((this->gravity & DoricGravity::DoricGravityCenterX) ==
             DoricGravity::DoricGravityCenterX) {
    xStart = (this->measuredWidth - this->contentWidth - this->paddingLeft -
              this->paddingRight) /
                 2 +
             this->paddingLeft;
  }
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }

    if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredWidth = this->measuredWidth - xStart -
                              layout->marginLeft - layout->marginRight;
    }

    if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit &&
        layout->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
      layout->measuredHeight =
          this->measuredHeight - layout->marginTop - layout->marginBottom;
    }

    layout->layout();

    int gravity = layout->alignment | this->gravity;
    if ((gravity & DoricGravity::DoricGravityTop) ==
        DoricGravity::DoricGravityTop) {
      layout->measuredY = this->paddingTop;
    } else if ((gravity & DoricGravity::DoricGravityBottom) ==
               DoricGravity::DoricGravityBottom) {
      layout->measuredY =
          this->measuredHeight - this->paddingBottom - layout->measuredHeight;
    } else if ((gravity & DoricGravity::DoricGravityCenterY) ==
               DoricGravity::DoricGravityCenterY) {
      layout->measuredY = this->measuredHeight / 2 - layout->measuredHeight / 2;
    } else {
      layout->measuredY = this->paddingTop;
    }
    if (!gravity) {
      gravity = DoricGravity::DoricGravityTop;
    }
    if (layout->marginTop && !((gravity & DoricGravity::DoricGravityBottom) ==
                               DoricGravity::DoricGravityBottom)) {
      layout->measuredY += layout->marginTop;
    }
    if (layout->marginBottom && !((gravity & DoricGravity::DoricGravityTop) ==
                                  DoricGravity::DoricGravityTop)) {
      layout->measuredY -= layout->marginBottom;
    }
    layout->measuredX = xStart + layout->marginLeft;
    xStart += this->spacing + layout->takenWidth();
  }
}

// Private Section
void DoricLayouts::setMeasuredWidth(int measuredWidth) {
  this->measuredWidth = measuredWidth;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredWidth: " << this->measuredWidth;
  if (this->measuredWidth > 1000 || this->measuredWidth < 0) {
    qDebug() << "";
  }
}

void DoricLayouts::setMeasuredHeight(int measuredHeight) {
  this->measuredHeight = measuredHeight;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredHeight: " << this->measuredHeight;
  if (this->measuredHeight > 2000 || this->measuredHeight < 0) {
    qDebug() << "";
  }
}
