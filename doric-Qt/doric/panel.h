#ifndef PANEL_H
#define PANEL_H

#include "context.h"

class Panel
{
private:
    Context *mContext;
    int renderedWidth = -1;
    int renderedHeight = -1;

public:
    Panel();

    void config(QString script, QString alias, QString extra);

    void config(Context *context);
};

#endif // PANEL_H
