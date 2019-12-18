#ifndef VIEW_NODE_H
#define VIEW_NODE_H

#include <QDebug>

#include "context_holder.h"

class SuperNode;

template <class T>
class ViewNode : public ContextHolder {

protected:
    T view;

private:
    SuperNode *superNode;
    QString *id;

public:
    ViewNode(Context *context) : ContextHolder(context) {}
};

#endif // VIEW_NODE_H
