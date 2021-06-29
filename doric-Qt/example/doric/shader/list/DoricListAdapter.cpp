#include "DoricListAdapter.h"

#include <QDebug>

DoricListAdapter::DoricListAdapter() {}

void DoricListAdapter::bind(QVariant rectangle, int position) {
  qDebug() << "==========" << rectangle << " " << position;
}
