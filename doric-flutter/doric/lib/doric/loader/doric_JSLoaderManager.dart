import 'dart:collection';

import 'package:doric/doric/loader/doric_asset_jsloader.dart';
import 'package:doric/doric/loader/idoric_JSLoader.dart';

class DoricJSLoaderManager {
  Set<IDoricJSLoader> _jsloader = new HashSet();

  DoricJSLoaderManager._(){
    addJSLoader(AssetJSLoader());
  }

  static final _instance = DoricJSLoaderManager._();

  factory DoricJSLoaderManager.getInstance() => _instance;
  void addJSLoader(IDoricJSLoader jsLoader) {
    _jsloader.add(jsLoader);
  }

  Set<IDoricJSLoader> getJSLoaders() {
    return _jsloader;
  }

  Future<String> loadJSBundle(String source) {
    if (source != null && source.isNotEmpty) {
      for (IDoricJSLoader loader in getJSLoaders()) {
        if (loader.filter(source)) {
          return loader.request(source);
        }
      }
    }
    return null;
  }
}
