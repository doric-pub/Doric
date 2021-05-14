#ifndef UTILS_H
#define UTILS_H

#include <QColor>
#include <QFile>
#include <QResource>
#include <QString>
#include <QTextStream>

class DoricUtils {
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

  template <typename Base, typename T>
  static inline bool instanceof (const T *) {
    return std::is_base_of<Base, T>::value;
  }

  static QColor doricColor(long colorValue) {
    float a = ((colorValue >> 24) & 0xff);
    float r = ((colorValue >> 16) & 0xff);
    float g = ((colorValue >> 8) & 0xff);
    float b = ((colorValue >> 0) & 0xff);
    return QColor(r, g, b, a);
  }
};

#endif // UTILS_H
