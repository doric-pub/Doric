class DoricLog {
  static const String _TAG_DEF = "LogUtil";

  //是否是debug模式
  static bool debuggable = true;
  static String TAG = _TAG_DEF;

  static void init({bool isDebug = false, String tag = _TAG_DEF}) {
    debuggable = isDebug;
    TAG = tag;
    i("init log" + isDebug.toString());
  }

  static void e(Object object, {String tag}) {
    if (debuggable) {
      _printLog(tag, '  e  ', object);
    }
  }

  static void i(Object object, {String tag}) {
    if (debuggable) {
      _printLog(tag, '  v  ', object);
    }
  }

  static void v(Object object, {String tag}) {
    if (debuggable) {
      _printLog(tag, '  v  ', object);
    }
  }

  static void _printLog(String tag, String stag, Object object) {
    String da = object.toString();
    String _tag = (tag == null || tag.isEmpty) ? TAG : tag;
    int maxPrint = 50;
    bool first = true;
    while (da.isNotEmpty) {
      String printData = da;
      if (da.length > maxPrint) {
        printData = da.substring(0, maxPrint);
        da = da.substring(maxPrint);
      } else {
        da = "";
      }
      if (first) {
        first = false;
        print("$_tag $stag $printData");
      } else {
        print("$printData");
      }
    }
  }
}
