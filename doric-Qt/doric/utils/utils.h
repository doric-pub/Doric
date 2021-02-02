#ifndef UTILS_H
#define UTILS_H

#include <QString>
#include <QResource>
#include <QFile>
#include <QTextStream>

class Utils
{
public:
    static QString readAssetFile(QString preffix, QString assetName) {
        QResource resource(":" + preffix + "/" + assetName);
        QFile *file = new QFile(resource.fileName());
        file->open(QFile::ReadOnly | QFile::Text);
        QTextStream in(file);
        in.setCodec("UTF-8");
        QString content = in.readAll();
        file->close();
        delete file;

        return content;
    }
};

#endif // UTILS_H
