#ifndef LAYER_H
#define LAYER_H

#include <QPainter>
#include <QWidget>

class Layer : public QWidget {

    void paintEvent(QPaintEvent *event) override {
        QPainter painter(this);
        QWidget::paintEvent(event);
    }

public:

    void setShadow(int sdColor, int sdOpacity, int sdRadius, int offsetX, int offsetY) {

    }

    void setBorder(int borderWidth, int borderColor) {

    }

    void setCornerRadius(int corner) {

    }

    void setCornerRadius(int leftTop, int rightTop, int rightBottom, int leftBottom) {

    }
};

#endif // LAYER_H
