import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:doric/doric/shader/doric_gravity.dart';
import 'package:doric/doric/shader/view_node.dart';

class Toast {
  static final int lengthShort = 1;
  static final int lengthLong = 2;
  static int current = 0;

  static void show(String msg, BuildContext context,
      {int duration = 1,
      int gravity,
      Color backgroundColor = const Color(0xAA000000),
      textStyle = const TextStyle(fontSize: 15, color: Colors.white),
      double backgroundRadius = 20,
      bool rootNavigator,
      Border border}) {
    current++;
    ToastView.dismiss();
    ToastView.createView(msg, context, duration, gravity, backgroundColor,
        textStyle, backgroundRadius, border, rootNavigator);
  }
}

class ToastView {
  static final ToastView _singleton = new ToastView._internal();

  factory ToastView() {
    return _singleton;
  }

  ToastView._internal();

  static OverlayState overlayState;
  static OverlayEntry _overlayEntry;
  static bool _isVisible = false;

  static void createView(
      String msg,
      BuildContext context,
      int duration,
      int gravity,
      Color background,
      TextStyle textStyle,
      double backgroundRadius,
      Border border,
      bool rootNavigator) async {
    overlayState = Overlay.of(context, rootOverlay: rootNavigator ?? false);

    Paint paint = Paint();
    paint.strokeCap = StrokeCap.square;
    paint.color = background;
    _overlayEntry = new OverlayEntry(
      builder: (BuildContext context) => ToastWidget(
          widget: Container(
            child: Container(
                alignment: Alignment.center,
                child: Container(
                  decoration: BoxDecoration(
                    color: background,
                    borderRadius: BorderRadius.circular(backgroundRadius),
                    border: border,
                  ),
                  margin: EdgeInsets.symmetric(horizontal: 20),
                  padding: EdgeInsets.fromLTRB(16, 10, 16, 10),
                  child: Text(msg, softWrap: true, style: textStyle),
                )),
          ),
          gravity: gravity),
    );
    _isVisible = true;
    overlayState.insert(_overlayEntry);
    var current = Toast.current;
    await Future.delayed(
        Duration(seconds: duration == null ? Toast.lengthLong : duration));
    if (current == Toast.current) {
      dismiss();
    }
  }

  static dismiss() async {
    if (!_isVisible) {
      return;
    }
    _isVisible = false;
    _overlayEntry?.remove();
  }
}

class ToastWidget extends StatelessWidget {
  ToastWidget({
    Key key,
    @required this.widget,
    @required this.gravity,
  }) : super(key: key);

  final Widget widget;
  final int gravity;

  @override
  Widget build(BuildContext context) {
    var theGravity =
        DoricGravity(gravity == 0 ? DoricGravity.DoricGravityBottom : gravity);
    double left, right, top, bottom;
    left = 50;
    right = 50;
    if (theGravity.isTop()) {
      top = MediaQuery.of(context).viewInsets.top + 50;
    } else if (theGravity.isBottom()) {
      bottom = MediaQuery.of(context).viewInsets.bottom + 50;
    } else {
      var height = MediaQuery.of(context).size.height -
          60 -
          MediaQuery.of(context).viewInsets.top -
          MediaQuery.of(context).viewInsets.bottom;
      top = height / 2.0;
      bottom = height / 2.0;
    }

    return new Positioned(
        top: top,
        left: left,
        right: right,
        bottom: bottom,
        child: Material(
          color: Colors.transparent,
          child: widget,
        ));
  }
}
