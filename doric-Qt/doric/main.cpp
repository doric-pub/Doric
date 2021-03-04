#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>

#include "demo/DoricDemoBridge.h"
#include "widget/flex/FlexLayoutService.h"

int main(int argc, char *argv[]) {
  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  QGuiApplication app(argc, argv);

  QQmlApplicationEngine engine;
  const QUrl url(QStringLiteral("qrc:/main.qml"));
  QObject::connect(
      &engine, &QQmlApplicationEngine::objectCreated, &app,
      [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
          QCoreApplication::exit(-1);
      },
      Qt::QueuedConnection);

  DoricDemoBridge *demoBridge = new DoricDemoBridge();
  auto context = engine.rootContext();
  context->setContextProperty("demoBridge", demoBridge);
  engine.load(url);

  qmlRegisterType<FlexLayoutService>("pub.doric.widget", 1, 0,
                                     "FlexLayoutService");
  return app.exec();
}
