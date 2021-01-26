//负责分发js方法
class DoricJSPatcher {
  int intervalTime = 30;
  Map<String, int> funcTimeMap = {};

  DoricJSPatcher({interval = 0}) {
    if (interval > 0) {
      this.intervalTime = interval;
      print(intervalTime);
    }
  }

  void dispatch(String func, Function function) {
    var lastTime = funcTimeMap[func] ?? 0;
    var nowTime = DateTime.now().millisecondsSinceEpoch;
    if (nowTime - lastTime > intervalTime) {
      function();
      funcTimeMap[func] = nowTime;
    }
  }
}
