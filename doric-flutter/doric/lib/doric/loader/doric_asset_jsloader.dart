import 'package:flutter/services.dart';
import 'package:doric/doric/loader/idoric_JSLoader.dart';

class AssetJSLoader extends IDoricJSLoader {
  @override
  bool filter(String source) {
    print(source);
    return source.startsWith("assets");
  }

  @override
  Future<String> request(String source) async {
    source=source.replaceFirst("assets://", "");
    print(source);
    String result =
        await rootBundle.loadString(source);
    return result;
  }
}
