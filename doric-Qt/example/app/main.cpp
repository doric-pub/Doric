#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QMovie>

#include "demo/DoricDemoBridge.h"
#include "widget/flex/FlexLayoutService.h"

int main(int argc, char *argv[]) {
  QCoreApplication::setAttribute(Qt::AA_EnableHighDpiScaling);

  QGuiApplication app(argc, argv);

  QQmlApplicationEngine engine;
  qmlRegisterType<FlexLayoutService>("pub.doric.widget", 1, 0,
                                     "FlexLayoutService");
//  const QUrl url(QStringLiteral("qrc:/doric/qml/test-layout.qml"));
  const QUrl url(QStringLiteral("qrc:/main.qml"));
  QObject::connect(
      &engine, &QQmlApplicationEngine::objectCreated, &app,
      [url](QObject *obj, const QUrl &objUrl) {
        if (!obj && url == objUrl)
          QCoreApplication::exit(-1);
      },
      Qt::QueuedConnection);

  auto context = engine.rootContext();
  DoricDemoBridge *demoBridge = new DoricDemoBridge();
  context->setContextProperty("demoBridge", demoBridge);

  qDebug() << QMovie::supportedFormats();

  engine.load(url);

  return app.exec();
}
