#include "DoricJSLoaderManager.h"
#include "DoricAssetJSLoader.h"

DoricJSLoaderManager::DoricJSLoaderManager() {
  qDebug() << "DoricJSLoaderManager constructor";

  addJSLoader(new DoricAssetJSLoader());
}

void DoricJSLoaderManager::addJSLoader(DoricInterfaceLoader *jsLoader) {
  jsLoaders.insert(jsLoader);
}

QSet<DoricInterfaceLoader *> *DoricJSLoaderManager::getJSLoaders() {
  return &jsLoaders;
}

std::shared_ptr<DoricAsyncResult>
DoricJSLoaderManager::request(QString source) {
  if (!source.isEmpty()) {
    if (source.startsWith("_internal_://")) {
    }
    foreach (DoricInterfaceLoader *jsLoader, jsLoaders) {
      if (jsLoader->filter(source)) {
        return jsLoader->request(source);
      }
    }
  }
  std::shared_ptr<DoricAsyncResult> asyncResult =
      std::make_shared<DoricAsyncResult>();
  return asyncResult;
}
