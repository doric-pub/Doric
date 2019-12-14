#include <QDebug>
#include <QFile>
#include <QResource>

#include "constant.h"
#include "js_engine.h"

JSEngine::JSEngine() {
    initJSEngine();
    injectGlobal();
    initDoricRuntime();
}

void JSEngine::prepareContext(int contextId, QString *script) {
    QString contextIdString = QString::number(contextId);
    QString source = QString(Constant::TEMPLATE_CONTEXT_CREATE)
            .replace("%s1", *script)
            .replace("%s2", contextIdString)
            .replace("%s3", contextIdString)
            .replace("%s4", contextIdString);
    QJSValue result = engine->evaluate(source, "context://" + contextIdString);
    qDebug() << "context://" + contextIdString + " result: " + result.toString();
}

void JSEngine::destroyContext(int contextId) {
    QString contextIdString = QString::number(contextId);
    QString source = QString(Constant::TEMPLATE_CONTEXT_DESTROY)
            .replace("%s", contextIdString);
    QJSValue result = engine->evaluate(source, "_context://" + contextIdString);
    qDebug() << "context://" + contextIdString + " result: " + result.toString();
}

void JSEngine::initJSEngine() {
    engine->installExtensions(QJSEngine::AllExtensions);
}

void JSEngine::injectGlobal() {
    QJSValue log = engine->newQObject(nativeLog);
    engine->globalObject().setProperty(Constant::INJECT_LOG, log.property("function"));

    QJSValue timer = engine->newQObject(nativeTimer);
    engine->globalObject().setProperty(Constant::INJECT_TIMER_SET, timer.property("setTimer"));
    engine->globalObject().setProperty(Constant::INJECT_TIMER_CLEAR, timer.property("clearTimer"));

    QJSValue empty = engine->newQObject(nativeEmpty);
    engine->globalObject().setProperty(Constant::INJECT_EMPTY, empty.property("function"));

    QJSValue bridge = engine->newQObject(nativeBridge);
    engine->globalObject().setProperty(Constant::INJECT_BRIDGE, bridge.property("function"));
}

void JSEngine::initDoricRuntime() {
    {
        QResource resource(":/doric/doric-sandbox.js");
        QFile *file = new QFile(resource.fileName());
        file->open(QFile::ReadOnly | QFile::Text);
        QTextStream in(file);
        QString script = in.readAll();
        file->close();
        delete file;

        QJSValue result = engine->evaluate(script, "doric-sandbox.js");
        qDebug() << "doric-sandbox.js result: " + result.toString();
    }

    {
        QResource resource(":/doric/doric-lib.js");
        QFile *file = new QFile(resource.fileName());
        file->open(QFile::ReadOnly | QFile::Text);
        QTextStream in(file);
        QString script = in.readAll();
        file->close();
        delete file;

        QString lib = QString(Constant::TEMPLATE_MODULE)
                .replace("%s1", "doric")
                .replace("%s2", script);
        QJSValue result = engine->evaluate(lib, "doric-lib.js");
        qDebug() << "doric-lib.js result: " + result.toString();
    }
}
