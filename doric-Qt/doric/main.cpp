#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>

#include "demo/demo_bridge.h"

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


    DemoBridge *demoBridge = new DemoBridge();
    auto context = engine.rootContext();
    context->setContextProperty("demoBridge", demoBridge);
    engine.load(url);
    return app.exec();
}
