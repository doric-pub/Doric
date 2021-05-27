#include "DoricTextNode.h"
#include "../utils/DoricUtils.h"

QQuickItem *DoricTextNode::build() {
  QQmlComponent component(getContext()->getQmlEngine());

  const QUrl url(QStringLiteral("qrc:/doric/qml/text.qml"));
  component.loadUrl(url);

  if (component.isError()) {
    qCritical() << component.errorString();
  }

  QQuickItem *item = qobject_cast<QQuickItem *>(component.create());
  this->createLayouts(item);

  item->setProperty("wrapper", QString::number((qint64)this));
  return item;
}

void DoricTextNode::blendLayoutConfig(QJsonValue jsObject) {
  DoricViewNode::blendLayoutConfig(jsObject);

  DoricLayouts *layout =
      (DoricLayouts *)(mView->property("doricLayout").toULongLong());

  QJsonValue maxWidth = jsObject["maxWidth"];
  if (maxWidth.isDouble()) {
    layout->setMaxWidth(maxWidth.toDouble());
  }
  QJsonValue maxHeight = jsObject["maxHeight"];
  if (maxHeight.isDouble()) {
    layout->setMaxHeight(maxHeight.toDouble());
  }
}

void DoricTextNode::blend(QQuickItem *view, QString name, QJsonValue prop) {
  if (name == "text") {
    view->setProperty("text", prop.toString());
  } else if (name == "textColor") {
    QString color = DoricUtils::doricColor(prop.toInt()).name();
    view->setProperty("color", color);
  } else if (name == "textSize") {
    QFont font = view->property("font").value<QFont>();
    font.setPixelSize(prop.toInt());
    view->setProperty("font", QVariant(font));
  } else if (name == "textAlignment") {
    view->setProperty("textAlignment", prop.toInt());
  } else if (name == "maxLines") {
    view->setProperty("lineCount", prop.toInt());
  } else if (name == "fontStyle") {
    view->setProperty("fontStyle", prop.toString());
  } else if (name == "font") {
    QString font = prop.toString();
    QString fontPath = "";
    QString fontName = font;

    if (font.contains("/")) {
      int separatorIndex = font.lastIndexOf("/");
      fontPath = QStringRef(&font, 0, separatorIndex + 1).toString();
      fontName = QStringRef(&font, separatorIndex + 1,
                            font.length() - separatorIndex - 1)
                     .toString();
    }

    if (fontName.endsWith(".ttf")) {
      fontName = fontName.replace(".ttf", "");
    }

    QString path = "qrc:/" + fontPath + fontName + ".ttf";

    view->setProperty("fontSource", path);
  } else if (name == "shadow") {
    view->setProperty("shadowColor", QVariant::fromValue(DoricUtils::doricColor(
                                         prop["color"].toInt())));
    view->setProperty("shadowRadius", prop["radius"].toDouble());
    view->setProperty("shadowOffsetX", prop["offsetX"].toDouble());
    view->setProperty("shadowOffsetY", prop["offsetY"].toDouble());
    view->setProperty("shadowOpacity", prop["opacity"].toDouble());
  } else if (name == "htmlText") {
    view->setProperty("text", prop.toString());
    view->setProperty("htmlText", true);
  } else if (name == "maxWidth") {
    DoricLayouts *layout =
        (DoricLayouts *)(mView->property("doricLayout").toULongLong());
    layout->setMaxWidth(prop.toDouble());
  } else if (name == "maxHeight") {
    DoricLayouts *layout =
        (DoricLayouts *)(mView->property("doricLayout").toULongLong());
    layout->setMaxHeight(prop.toDouble());
  } else if (name == "strikethrough") {
    view->setProperty("strikethrough", prop.toBool());
  } else if (name == "underline") {
    view->setProperty("underline", prop.toBool());
  } else if (name == "lineSpacing") {
    view->setProperty("lineSpacing", prop.toDouble());
  } else {
    DoricViewNode::blend(view, name, prop);
  }
}
