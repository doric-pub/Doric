#include "DoricGlobalBroadcast.h"

QString DoricGlobalBroadcast::subscribe(QString name,
                                        std::function<void(QString)> callback) {
  int id = this->idGenerator.fetchAndAddAcquire(1);
  QPair<QString, std::function<void(QString)>> pair(QString::number(id),
                                                    callback);
  if (this->subjects.contains(name)) {
    QList<QPair<QString, std::function<void(QString)>>> value =
        this->subjects[name];
    value.append(pair);
    this->subjects.insert(name, value);
  } else {
    QList<QPair<QString, std::function<void(QString)>>> value;
    value.append(pair);
    this->subjects.insert(name, value);
  }

  return QString::number(id);
}

void DoricGlobalBroadcast::unsubscribe(QString subscribeId) {

  QString targetKey;
  int targetIndex = -1;
  foreach (QString key, this->subjects.keys()) {
    QList<QPair<QString, std::function<void(QString)>>> value =
        this->subjects[key];

    for (int i = 0; i != value.size(); i++) {
      QPair<QString, std::function<void(QString)>> pair = value.at(i);
      if (pair.first == subscribeId) {
        targetKey = key;
        targetIndex = i;
      }
    }
  }

  if (targetKey.isEmpty()) {
    return;
  } else {
    QList<QPair<QString, std::function<void(QString)>>> value =
        this->subjects[targetKey];
    value.removeAt(targetIndex);
    this->subjects.insert(targetKey, value);
  }
}

void DoricGlobalBroadcast::publish(QString name, QString data) {
  if (this->subjects.contains(name)) {
    QList<QPair<QString, std::function<void(QString)>>> value =
        this->subjects[name];

    for (int i = 0; i != value.size(); i++) {
      QPair<QString, std::function<void(QString)>> pair = value.at(i);
      pair.second(data);
    }
  }
}
