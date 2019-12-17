#ifndef SUPER_NODE_H
#define SUPER_NODE_H

#include <QJSValue>
#include <QMap>
#include <QtPlugin>

#include "view_node.h"

template <typename V>
class SuperNode : public ViewNode<V> {

private:
    QMap<QString, QJSValue> subNodes;

protected:
    bool reusable = false;

public:
    virtual ~SuperNode() = default;

    virtual ViewNode<V> *getSubNodeById(QString *id) = 0;
};

#endif // SUPER_NODE_H
