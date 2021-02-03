#include <QDebug>

#include "demo_bridge.h"
#include "utils/utils.h"
#include "panel.h"

DemoBridge::DemoBridge(QObject *parent) : QObject(parent)
{

}

void DemoBridge::navigate(QVariant route)
{
    switch (route.toInt()) {
    case 0:
        QString name = "Snake.es5.js";
        QString script = Utils::readAssetFile("/doric/bundles", name);

        Panel panel;
        panel.config(script, name, NULL);
        break;
    }
}
