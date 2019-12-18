#include <QApplication>
#include <QDialog>
#include <QFile>
#include <QResource>

#include "context_manager.h"

int main(int argc, char *argv[])
{
    QApplication app(argc, argv);
    {
        QWidget *widget = new QWidget(nullptr, Qt::WindowType::Window);
        widget->setWindowTitle(QString("Hello Doric"));
        widget->resize(360, 640);
        widget->show();
    }
    {
        QResource resource(":/doric/Snake.js");
        QFile *file = new QFile(resource.fileName());
        file->open(QFile::ReadOnly | QFile::Text);
        QTextStream in(file);
        QString script = in.readAll();
        file->close();
        delete file;

        QString *source = new QString("Snake.js");
        Context *context = ContextManager::getInstance()->createContext(&script, source);
        context->show();
        context->init(180, 320);
        delete source;
    }

    return app.exec();
}
