#ifndef DEMOBRIDGE_H
#define DEMOBRIDGE_H

#include <QObject>
#include <QVariant>

class DemoBridge : public QObject
{
    Q_OBJECT
public:
    explicit DemoBridge(QObject *parent = nullptr);

    Q_INVOKABLE
    void navigate(QVariant route);
signals:

};

#endif // DEMOBRIDGE_H
