#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QDebug>

#include "engine/js_engine.h"
#include "async/async_result.h"
#include "context_manager.h"
#include "utils/utils.h"

int main(int argc, char *argv[])
{
    QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

    QGuiApplication app(argc, argv);

    QQmlApplicationEngine engine;
    const QUrl url(QStringLiteral("qrc:/main.qml"));
    QObject::connect(&engine, &QQmlApplicationEngine::objectCreated,
                     &app, [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
            QCoreApplication::exit(-1);
    }, Qt::QueuedConnection);
    engine.load(url);

    JSEngine jsEngine;

    QString script = Utils::readAssetFile("doric", "Snake.js");
    ContextManager::getInstance()->createContext(script, "", "");

    return app.exec();
}
