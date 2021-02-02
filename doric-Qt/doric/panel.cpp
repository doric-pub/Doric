#include "panel.h"

Panel::Panel()
{

}

void Panel::config(QString script, QString alias, QString extra)
{
    Context *context = Context::create(script, alias, extra);
    config(context);
}

void Panel::config(Context *context)
{
    this->mContext = context;
    this->mContext->build(960, 720);
}
