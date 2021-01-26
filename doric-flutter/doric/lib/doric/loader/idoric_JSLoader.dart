abstract class IDoricJSLoader {
  bool filter(String source);

  Future<String> request(String source);
}
