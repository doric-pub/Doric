#ifndef DORICLISTADAPTER_H
#define DORICLISTADAPTER_H

#include <QVariant>

class DoricListAdapter {
public:
  DoricListAdapter();

  void bind(QVariant rectangle, int position);
};

#endif // DORICLISTADAPTER_H
