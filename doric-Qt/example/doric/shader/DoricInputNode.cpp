#include "DoricInputNode.h"
#include "../utils/DoricUtils.h"

QQuickItem *DoricInputNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/input.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricInputNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "text") {
    view->setProperty("text", prop.toString());
  } else if (name == "textColor") {
    QString color = DoricUtils::doricColor(prop.toInt()).name();
    view->setProperty("color", color);
  } else if (name == "textSize") {
    QFont font = view->property("font").value<QFont>();
    font.setPixelSize(prop.toInt());
    view->setProperty("font", QVariant(font));
  } else if (name == "hintText") {
    view->setProperty("placeholderText", prop.toString());
  } else if (name == "textAlignment") {
    view->setProperty("textAlignment", prop.toInt());
  } else if (name == "onTextChange") {
    this->onTextChangeId = prop.toString();
  } else if (name == "onFocusChange") {
    this->onFocusChangeId = prop.toString();
  } else if (name == "padding") {
    DoricViewNode::blend(view, name, prop);
    view->setProperty("leftPadding", prop["left"].toDouble());
    view->setProperty("rightPadding", prop["right"].toDouble());
    view->setProperty("topPadding", prop["top"].toDouble());
    view->setProperty("bottomPadding", prop["bottom"].toDouble());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}

QSizeF DoricInputNode::sizeThatFits(QSizeF size) {
  DoricLayouts *layout =
      (DoricLayouts *)mView->property("doricLayout").toULongLong();

  QSizeF ret = DoricViewNode::sizeThatFits(size);
  return QSizeF(
      ret.width() - layout->getPaddingLeft() - layout->getPaddingRight(),
      ret.height() - layout->getPaddingTop() - layout->getPaddingBottom());
}

void DoricInputNode::onTextChange(QString text) {
  if (!onTextChangeId.isEmpty()) {
    QVariantList args;
    args.append(text);
    callJSResponse(onTextChangeId, args);
  }
}
