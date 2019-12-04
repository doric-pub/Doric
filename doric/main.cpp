#include <QFile>
#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QTextStream>

#include "context_manager.h"

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

    QFile* file = new QFile("/Users/maverick/Workspace/doric/demo/bundle/src/Snake.js");
    file->open(QFile::ReadOnly | QFile::Text);
    QTextStream in(file);
    QString script = in.readAll();
    file->close();
    delete file;

    QString* source = new QString("Snake.js");
    ContextManager::getInstance()->createContext(&script, source);
    return app.exec();
}
