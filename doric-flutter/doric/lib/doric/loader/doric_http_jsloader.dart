

import 'package:doric/doric/loader/idoric_JSLoader.dart';

class HttpJSLoader extends IDoricJSLoader{


  @override
  bool filter(String source) {
    return source.startsWith("http");
  }

  @override
  Future<String> request(String source) {

  }

}