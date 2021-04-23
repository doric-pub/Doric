#include "DoricLayouts.h"
#include "shader/DoricScrollerNode.h"

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

void DoricLayouts::setWidth(qreal width) { this->width = width; }
void DoricLayouts::setHeight(qreal height) { this->height = height; }

void DoricLayouts::setSpacing(qreal spacing) { this->spacing = spacing; }

void DoricLayouts::setMarginLeft(qreal marginLeft) {
  this->marginLeft = marginLeft;
}
void DoricLayouts::setMarginTop(qreal marginTop) {
  this->marginTop = marginTop;
}
void DoricLayouts::setMarginRight(qreal marginRight) {
  this->marginRight = marginRight;
}
void DoricLayouts::setMarginBottom(qreal marginBottom) {
  this->marginBottom = marginBottom;
}

void DoricLayouts::setPaddingLeft(qreal paddingLeft) {
  this->paddingLeft = paddingLeft;
}
void DoricLayouts::setPaddingTop(qreal paddingTop) {
  this->paddingTop = paddingTop;
}
void DoricLayouts::setPaddingRight(qreal paddingRight) {
  this->paddingRight = paddingRight;
}
void DoricLayouts::setPaddingBottom(qreal paddingBottom) {
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

void DoricLayouts::setMaxWidth(qreal maxWidth) { this->maxWidth = maxWidth; }
void DoricLayouts::setMaxHeight(qreal maxHeight) {
  this->maxHeight = maxHeight;
}
void DoricLayouts::setMinWidth(qreal minWidth) { this->minWidth = minWidth; }
void DoricLayouts::setMinHeight(qreal minHeight) {
  this->minHeight = minHeight;
}

void DoricLayouts::apply(QSizeF frameSize) {
  this->resolved = false;

  this->measure(frameSize);
  this->setFrame();

  this->resolved = true;
}

void DoricLayouts::apply() {
  this->apply(QSizeF(this->view->width(), this->view->height()));
}

void DoricLayouts::measure(QSizeF targetSize) {
  this->measureSelf(targetSize);
  this->layout();
}

void DoricLayouts::measureSelf(QSizeF targetSize) {
  // measure width
  qreal width;
  if (this->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
    QQuickItem *parent = this->view->parentItem();
    DoricLayouts *parentDoricLayout =
        (DoricLayouts *)(parent->property("doricLayout").toULongLong());
    if (parentDoricLayout != nullptr &&
        parentDoricLayout->layoutType == DoricLayoutType::DoricHLayout &&
        this->weight > 0) {
      width = 0;
      setMeasuredWidth(0);
    } else {
      width = targetSize.width();
      setMeasuredWidth(targetSize.width());
    }
  } else if (this->widthSpec == DoricLayoutSpec::DoricLayoutJust) {
    width = this->width;
    setMeasuredWidth(this->width);
  } else {
    width = targetSize.width();
  }

  // measure height
  qreal height;
  if (this->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
    QQuickItem *parent = this->view->parentItem();
    DoricLayouts *parentDoricLayout =
        (DoricLayouts *)(parent->property("doricLayout").toULongLong());
    if (parentDoricLayout != nullptr &&
        parentDoricLayout->layoutType == DoricLayoutType::DoricVLayout &&
        this->weight > 0) {
      height = 0;
      setMeasuredHeight(0);
    } else {
      height = targetSize.height();
      setMeasuredHeight(targetSize.height());
    }
  } else if (this->heightSpec == DoricLayoutSpec::DoricLayoutJust) {
    height = this->height;
    setMeasuredHeight(this->height);
  } else {
    height = targetSize.height();
  }

  // measure content
  this->measureContent(QSizeF(width - this->paddingLeft - this->paddingRight,
                              height - this->paddingTop - this->paddingBottom));

  if (this->restrainSize()) {
    this->measureContent(
        QSizeF(this->measuredWidth - this->paddingLeft - this->paddingRight,
               this->measuredHeight - this->paddingTop - this->paddingBottom));
  }
  this->restrainSize();
}

void DoricLayouts::measureContent(QSizeF targetSize) {
  qCritical() << "measureContent: " << tag << this->view->property("uuid");
  switch (this->layoutType) {
  case DoricLayoutType::DoricStack: {
    this->measureStackContent(targetSize);
    break;
  }
  case DoricLayoutType::DoricVLayout: {
    this->measureVLayoutContent(targetSize);
    break;
  }
  case DoricLayoutType::DoricHLayout: {
    this->measureHLayoutContent(targetSize);
    break;
  }
  default: {
    this->measureUndefinedContent(targetSize);
    break;
  }
  }

  QQuickItem *parent = this->view->parentItem();
  if (parent != nullptr) {
    DoricLayouts *parentDoricLayout =
        (DoricLayouts *)(parent->property("doricLayout").toULongLong());
    if (parentDoricLayout != nullptr) {
      if (parentDoricLayout->layoutType != DoricLayoutType::DoricUndefined &&
          parentDoricLayout->widthSpec == DoricLayoutSpec::DoricLayoutFit &&
          this->widthSpec == DoricLayoutSpec::DoricLayoutMost) {
        setMeasuredWidth(targetSize.width());
      }
      if (parentDoricLayout->layoutType != DoricLayoutType::DoricUndefined &&
          parentDoricLayout->heightSpec == DoricLayoutSpec::DoricLayoutFit &&
          this->heightSpec == DoricLayoutSpec::DoricLayoutMost) {
        setMeasuredHeight(targetSize.height());
      }
    }
  }
}

void DoricLayouts::measureUndefinedContent(QSizeF targetSize) {
  // begin size that fits
  QSizeF measuredSize;

  if (tag == "Scroller") {
    QObject *object =
        (QObject *)(this->view->property("wrapper").toULongLong());
    DoricScrollerNode *viewNode = dynamic_cast<DoricScrollerNode *>(object);
    measuredSize = viewNode->sizeThatFits(targetSize);
  } else {
    qreal actualWidth = this->view->width();
    qreal actualHeight = this->view->height();

    measuredSize = QSizeF(actualWidth, actualHeight);
  }
  // end size that fits

  if (this->widthSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredWidth(measuredSize.width() + this->paddingLeft +
                     this->paddingRight);
  }
  if (this->heightSpec == DoricLayoutSpec::DoricLayoutFit) {
    setMeasuredHeight(measuredSize.height() + this->paddingTop +
                      this->paddingBottom);
  }
}
void DoricLayouts::measureStackContent(QSizeF targetSize) {
  qreal contentWidth = 0, contentHeight = 0;
  foreach (QQuickItem *subview, this->view->childItems()) {
    DoricLayouts *layout =
        (DoricLayouts *)(subview->property("doricLayout").toULongLong());
    if (layout == nullptr) {
      continue;
    }

    if (layout->disabled) {
      continue;
    }

    layout->measure(layout->removeMargin(targetSize));
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
void DoricLayouts::measureVLayoutContent(QSizeF targetSize) {
  qreal contentWidth = 0, contentHeight = 0, contentWeight = 0;
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

    layout->measure(layout->removeMargin(
        QSizeF(targetSize.width(), targetSize.height() - contentHeight)));
    contentWidth = qMax(contentWidth, layout->takenWidth());
    contentHeight += layout->takenHeight() + this->spacing;
    contentWeight += layout->weight;
  }

  if (had) {
    contentHeight -= this->spacing;
  }

  if (contentWeight > 0) {
    qreal remaining = targetSize.height() - contentHeight;
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
      qreal measuredHeight =
          layout->measuredHeight + remaining / contentWeight * layout->weight;
      layout->measuredHeight = measuredHeight;
      // Need Remeasure
      layout->measureContent(QSizeF(
          layout->measuredWidth - layout->paddingLeft - layout->paddingRight,
          measuredHeight - layout->paddingTop - layout->paddingBottom));
      layout->measuredHeight = measuredHeight;
      contentWidth = qMax(contentWidth, layout->takenWidth());
    }
    contentHeight = targetSize.height();
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
void DoricLayouts::measureHLayoutContent(QSizeF targetSize) {
  qreal contentWidth = 0, contentHeight = 0, contentWeight = 0;
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

    layout->measure(layout->removeMargin(
        QSizeF(targetSize.width() - contentWidth, targetSize.height())));
    contentWidth += layout->takenWidth() + this->spacing;
    contentHeight = qMax(contentHeight, layout->takenHeight());
    contentWeight += layout->weight;
  }

  if (had) {
    contentWidth -= this->spacing;
  }

  if (contentWeight > 0) {
    qreal remaining = targetSize.width() - contentWidth;
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
      qreal measuredWidth =
          layout->measuredWidth + remaining / contentWeight * layout->weight;
      layout->measuredWidth = measuredWidth;
      // Need Remeasure
      layout->measureContent(QSizeF(
          measuredWidth - layout->paddingLeft - layout->paddingRight,
          layout->measuredHeight - layout->paddingTop - layout->paddingBottom));
      layout->measuredWidth = measuredWidth;
      contentHeight = qMax(contentHeight, layout->takenHeight());
    }
    contentWidth = targetSize.width();
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

qreal DoricLayouts::takenWidth() {
  return this->measuredWidth + this->marginLeft + this->marginRight;
}
qreal DoricLayouts::takenHeight() {
  return this->measuredHeight + this->marginTop + this->marginBottom;
}
QSizeF DoricLayouts::removeMargin(QSizeF targetSize) {
  return QSizeF(targetSize.width() - this->marginLeft - this->marginRight,
                targetSize.height() - this->marginTop - this->marginBottom);
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

  qCritical() << "DoricLayouts setProperty: " << tag
              << this->view->property("uuid")
              << " measuredWidth: " << this->measuredWidth
              << " measuredHeight: " << this->measuredHeight
              << " width: " << this->view->width()
              << " height: " << this->view->height()
              << " measuredX: " << this->measuredX
              << " measuredY: " << this->measuredY;

  if (qFabs(this->measuredWidth - this->view->width() >= 0.00001f))
    this->view->setProperty("width", this->measuredWidth);
  if (qFabs(this->measuredHeight - this->view->height() >= 0.00001f))
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
      layout->setMeasuredX(this->paddingLeft);
    } else if ((gravity & DoricGravity::DoricGravityRight) ==
               DoricGravity::DoricGravityRight) {
      layout->setMeasuredX(this->measuredWidth - this->paddingRight -
                           layout->measuredWidth);
    } else if ((gravity & DoricGravity::DoricGravityCenterX) ==
               DoricGravity::DoricGravityCenterX) {
      layout->setMeasuredX(this->measuredWidth / 2 - layout->measuredWidth / 2);
    } else {
      if (layout->marginLeft || layout->marginRight) {
        layout->setMeasuredX(this->paddingLeft);
      } else {
        layout->setMeasuredX(0);
      }
    }

    if ((gravity & DoricGravity::DoricGravityTop) ==
        DoricGravity::DoricGravityTop) {
      layout->setMeasuredY(this->paddingTop);
    } else if ((gravity & DoricGravity::DoricGravityBottom) ==
               DoricGravity::DoricGravityBottom) {
      layout->setMeasuredY(this->measuredHeight - this->paddingBottom -
                           layout->measuredHeight);
    } else if ((gravity & DoricGravity::DoricGravityCenterY) ==
               DoricGravity::DoricGravityCenterY) {
      layout->setMeasuredY(this->measuredHeight / 2 -
                           layout->measuredHeight / 2);
    } else {
      if (layout->marginTop || layout->marginBottom) {
        layout->setMeasuredY(this->paddingTop);
      } else {
        layout->setMeasuredY(0);
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
  qreal yStart = this->paddingTop;
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
      layout->setMeasuredX(this->paddingLeft);
    } else if ((gravity & DoricGravity::DoricGravityRight) ==
               DoricGravity::DoricGravityRight) {
      layout->setMeasuredX(this->measuredWidth - this->paddingRight -
                           layout->measuredWidth);
    } else if ((gravity & DoricGravity::DoricGravityCenterX) ==
               DoricGravity::DoricGravityCenterX) {
      layout->setMeasuredX(this->measuredWidth / 2 - layout->measuredWidth / 2);
    } else {
      layout->setMeasuredX(this->paddingLeft);
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
    layout->setMeasuredY(yStart + layout->marginTop);
    yStart += this->spacing + layout->takenHeight();
  }
}

void DoricLayouts::layoutHLayout() {
  qreal xStart = this->paddingLeft;
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
      layout->setMeasuredY(this->paddingTop);
    } else if ((gravity & DoricGravity::DoricGravityBottom) ==
               DoricGravity::DoricGravityBottom) {
      layout->setMeasuredY(this->measuredHeight - this->paddingBottom -
                           layout->measuredHeight);
    } else if ((gravity & DoricGravity::DoricGravityCenterY) ==
               DoricGravity::DoricGravityCenterY) {
      layout->setMeasuredY(this->measuredHeight / 2 -
                           layout->measuredHeight / 2);
    } else {
      layout->setMeasuredY(this->paddingTop);
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
    layout->setMeasuredX(xStart + layout->marginLeft);
    xStart += this->spacing + layout->takenWidth();
  }
}

// Private Section
void DoricLayouts::setMeasuredWidth(qreal measuredWidth) {
  this->measuredWidth = measuredWidth;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredWidth: " << this->measuredWidth;
}

qreal DoricLayouts::getMeasuredWidth() { return this->measuredWidth; }

void DoricLayouts::setMeasuredHeight(qreal measuredHeight) {
  this->measuredHeight = measuredHeight;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredHeight: " << this->measuredHeight;
}

qreal DoricLayouts::getMeasuredHeight() { return this->measuredHeight; }

void DoricLayouts::setMeasuredX(qreal measuredX) {
  this->measuredX = measuredX;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredX: " << this->measuredX;
}

void DoricLayouts::setMeasuredY(qreal measuredY) {
  this->measuredY = measuredY;
  qCritical() << "DoricLayouts: " << tag << this->view->property("uuid")
              << " measuredY: " << this->measuredY;
}
