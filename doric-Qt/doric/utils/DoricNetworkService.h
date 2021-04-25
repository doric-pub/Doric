#ifndef DORICNETWORKSERVICE_H
#define DORICNETWORKSERVICE_H

#include <QDebug>
#include <QJsonObject>
#include <QJsonValue>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QNetworkRequest>
#include <QThread>

class InnerTask : public QObject {
  Q_OBJECT
private:
  QNetworkRequest httpRequest;
  QNetworkAccessManager networkAccessManager;

public:
  explicit InnerTask() {
    connect(this, &InnerTask::run, this, &InnerTask::innerRun);
  }

  void innerRun(QJsonValue jsValue) {
    QString url = jsValue["url"].toString();
    QString method = jsValue["method"].toString();

    QJsonValue headerVal = jsValue["headers"];
    QJsonValue dataVal = jsValue["data"];
    QJsonValue timeoutVal = jsValue["timeout"];

    if (headerVal.isObject()) {
      foreach (QString key, headerVal.toObject().keys()) {
        httpRequest.setRawHeader(key.toUtf8(),
                                 headerVal[key].toString().toUtf8());
      }
    }

    if (method == "get") {
      httpRequest.setUrl(QUrl(url));
      QNetworkReply *reply = networkAccessManager.get(httpRequest);

      connect(reply, &QNetworkReply::finished, this, [this, reply] {
        int statusCode =
            reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();

        if (reply->error() == QNetworkReply::NoError) {
          emit response(statusCode, reply->readAll());
        } else {
          emit response(statusCode, QByteArray());
        }

        reply->deleteLater();
        this->deleteLater();
      });
    }
  }
signals:
  void run(QJsonValue jsValue);
  void response(int code, QByteArray data);
};

class DoricNetworkService : public QObject {
  Q_OBJECT
private:
  QThread thread;

  static DoricNetworkService *local_instance;
  DoricNetworkService() {
    qDebug() << "constructor";
    thread.start();
  }

  ~DoricNetworkService() { qDebug() << "destructor"; }

public:
  static DoricNetworkService *getInstance() {
    static DoricNetworkService instance;
    return &instance;
  }

  QThread *getThread() { return &thread; }

  template <typename T>
  void request(QJsonValue jsValue, QObject *receiver, T lambda) {
    InnerTask *innerTask = new InnerTask();
    innerTask->moveToThread(&thread);

    connect(innerTask, &InnerTask::response, receiver, lambda);
    innerTask->run(jsValue);
  }
};

#endif // DORICNETWORKSERVICE_H
