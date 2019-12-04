#ifndef JS_ENGINE_H
#define JS_ENGINE_H

#include <QFile>
#include <QObject>
#include <QJSEngine>

#include "constant.h"
#include "native/native_empty.h"
#include "native/native_log.h"
#include "native/native_timer.h"

class JSEngine : public QObject {
    Q_OBJECT

public:
    QJSEngine *engine;
    JSEngine(QObject *parent = nullptr) : QObject(parent) {
        initJSEngine();
        injectGlobal();
        initDoricRuntime();
    }

    void prepareContext(int contextId, QString* script) {
        QString contextIdString = QString::number(contextId);
        QString source = QString(Constant::TEMPLATE_CONTEXT_CREATE)
                .replace("%s1", *script)
                .replace("%s2", contextIdString)
                .replace("%s3", contextIdString)
                .replace("%s4", contextIdString);
        QJSValue result = engine->evaluate(source, "context://" + contextIdString);
        qDebug() << "context://" + contextIdString + " result: " + result.toString();
    }

    void destroyContext(int contextId) {
        QString contextIdString = QString::number(contextId);
        QString source = QString(Constant::TEMPLATE_CONTEXT_DESTROY)
                .replace("%s", contextIdString);
        QJSValue result = engine->evaluate(source, "_context://" + contextIdString);
        qDebug() << "context://" + contextIdString + " result: " + result.toString();
    }

private:
    void initJSEngine() {
        engine = new QJSEngine();
        engine->installExtensions(QJSEngine::AllExtensions);
    }

    void injectGlobal() {
        QJSValue nativeLog = engine->newQObject(new NativeLog());
        engine->globalObject().setProperty(Constant::INJECT_LOG, nativeLog.property("function"));

        QJSValue nativeTimer = engine->newQObject(new NativeTimer(engine));
        engine->globalObject().setProperty(Constant::INJECT_TIMER_SET, nativeTimer.property("setTimer"));
        engine->globalObject().setProperty(Constant::INJECT_TIMER_CLEAR, nativeTimer.property("clearTimer"));

        QJSValue nativeEmpty = engine->newQObject(new NativeEmpty());
        engine->globalObject().setProperty(Constant::INJECT_EMPTY, nativeEmpty.property("function"));
    }

    void initDoricRuntime() {
        {
            QFile *file = new QFile("/Users/maverick/Workspace/doric/js-framework/bundle/doric-sandbox.js");
            file->open(QFile::ReadOnly | QFile::Text);
            QTextStream in(file);
            QString script = in.readAll();
            file->close();
            delete file;

            QJSValue result = engine->evaluate(script, "doric-sandbox.js");
            qDebug() << "doric-sandbox.js result: " + result.toString();
        }

        {
            QFile *file = new QFile("/Users/maverick/Workspace/doric/js-framework/bundle/doric-lib.js");
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
};

#endif // JS_ENGINE_H
