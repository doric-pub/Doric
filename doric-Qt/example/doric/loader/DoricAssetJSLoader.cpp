#include "DoricAssetJSLoader.h"

#include "utils/DoricUtils.h"

DoricAssetJSLoader::DoricAssetJSLoader() {}

bool DoricAssetJSLoader::filter(QString source) {
  return source.startsWith("assets");
}

std::shared_ptr<DoricAsyncResult> DoricAssetJSLoader::request(QString source) {
  QString protocol = "assets://";
  QString assetPath = source.mid(protocol.length());

  std::shared_ptr<DoricAsyncResult> asyncResult =
      std::make_shared<DoricAsyncResult>();

  return asyncResult;
}
