#ifndef NATIVELOG_H
#define NATIVELOG_H

#include <QObject>
#include <QDebug>

class NativeLog : public QObject {
    Q_OBJECT

public:
    NativeLog(QObject *parent = nullptr) : QObject(parent) {}

    Q_INVOKABLE void function(QString level, QString content) {
        if (level == 'w') {
            qWarning() << content;
        } else if (level == 'd') {
            qDebug() << content;
        } else if (level == 'e') {
            qCritical() << content;
        }
    }
};

#endif // NATIVELOG_H
