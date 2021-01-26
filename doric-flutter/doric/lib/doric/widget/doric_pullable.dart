import 'dart:async';

import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

abstract class PullingListener {
  void startAnimation();

  void stopAnimation();

  /// Set the amount of rotation to apply to the progress spinner.
  ///
  /// @param rotation Rotation is from [0..2]
  void setPullingDistance(double rotation);
}

const _AUTO_TIME = Duration(milliseconds: 250);

typedef RefreshCallback = void Function();

class DoricSwipeLayout extends StatefulWidget {
  Widget body;
  Widget headerView;
  RefreshCallback onRefresh;
  PullingListener pullingListener;
  _DoricSwipeState _state;
  GlobalKey key;

  DoricSwipeLayout({this.body,
    this.headerView,
    this.onRefresh,
    this.pullingListener,
    this.key})
      : super(key: key);

  bool isRefreshing() {
    return _state?.isRefreshing();
  }

  bool isRefreshable() {
    return _state?.isRefreshable();
  }

  void setRefreshing(bool refreshing) {
    _state?.setRefreshing(refreshing);
  }

  void setRefreshable(bool refreshable) {
    _state?.setRefreshable(refreshable);
  }

  @override
  State<StatefulWidget> createState() {
    return _state = _DoricSwipeState();
  }
}

class _DoricSwipeState extends State<DoricSwipeLayout>
    with TickerProviderStateMixin<DoricSwipeLayout> {
  double refreshScrollTop = 100;
  double maxScrollTop = 200;
  double pullRadio = 0.5;
  DragController _controller;
  double offsetDistance = 0;
  bool onResetControllerValue = false;
  Animation<double> animation;
  AnimationController animalController;

  @override
  void initState() {
    super.initState();
    animalController = AnimationController(vsync: this, duration: _AUTO_TIME);
    _controller = new DragController();

    _controller.setDrag((dragDistance, dragState) {
      if (dragState == ScrollNotificationListener.end) {
        var start = 0.0;
        var end = 0.0;
        var refresh = false;
        onResetControllerValue = true;
        if (offsetDistance <= refreshScrollTop) {
          start = offsetDistance;
          end = 0.0;
        } else {
          start = offsetDistance;
          end = refreshScrollTop;
          refresh = true;
        }
        _reset(start, end, refresh);
        widget.pullingListener?.stopAnimation();
        if (refresh) {
          Timer(_AUTO_TIME, () {
            widget.onRefresh();
          });
        }
      } else if (dragState == ScrollNotificationListener.start) {
        widget.pullingListener?.startAnimation();
      } else {
        offsetDistance += dragDistance;
        widget.pullingListener.setPullingDistance(offsetDistance);
        setState(() {});
      }
    });
  }

  void _reset(double start, double end, bool refresh) {
    animalController.value = 0.0;
    onResetControllerValue = false;
    final CurvedAnimation curve =
    new CurvedAnimation(parent: animalController, curve: Curves.easeOut);
    animation = Tween(begin: start, end: end).animate(curve)
      ..addListener(() {
        if (!onResetControllerValue) {
          offsetDistance = animation.value;
          setState(() {});
        }
      });
    animalController.forward();
  }

  @override
  void dispose() {
    super.dispose();
  }

  void setRefreshable(bool enable) {}

  bool isRefreshable() {
    return false;
  }

  void setRefreshing(bool refreshing) {
    if (!refreshing) {
      _reset(offsetDistance, 0, false);
    }
  }

  bool isRefreshing() {
    return false;
  }

  @override
  Widget build(BuildContext context) {
    widget._state = this;
    if (offsetDistance >= maxScrollTop) {
      offsetDistance = maxScrollTop;
    }
    if (offsetDistance < 0) {
      offsetDistance = 0;
    }
    var ratio = offsetDistance / maxScrollTop;
    return Stack(
      children: [
        Transform.translate(
          offset: Offset(0.0, -100 * (1 - ratio)),
          child: widget.headerView,
        ),
        Transform.translate(
            offset: Offset(0.0, offsetDistance),
            child: OverScrollNotificationWidget(
                child: widget.body, dragController: _controller))
      ],
    );
  }
}

typedef DragListener = void Function(
    double dragDistance, ScrollNotificationListener dragState);
enum ScrollNotificationListener {
  ///滑动开始
  start,

  ///滑动结束
  end,

  ///滑动时，控件在边缘（最上面显示或者最下面显示）位置
  edge
}

class DragController {
  DragListener _dragListener;

  setDrag(DragListener l) {
    _dragListener = l;
  }

  void updateDragDistance(double dragDistance,
      ScrollNotificationListener dragState) {
    if (_dragListener != null) {
      _dragListener(dragDistance, dragState);
    }
  }
}

class OverScrollNotificationWidget extends StatefulWidget {
  final Widget child;
  final DragController dragController;

  const OverScrollNotificationWidget({
    Key key,
    this.dragController,
    @required this.child,
//    this.scrollListener,
  })
      : assert(child != null),
        super(key: key);

  @override
  OverScrollNotificationWidgetState createState() =>
      OverScrollNotificationWidgetState(dragController);
}

/// Contains the state for a [OverScrollNotificationWidget]. This class can be used to
/// programmatically show the refresh indicator, see the [show] method.
class OverScrollNotificationWidgetState
    extends State<OverScrollNotificationWidget>
    with TickerProviderStateMixin<OverScrollNotificationWidget> {
  final GlobalKey _key = GlobalKey();
  DragController _controller;

  OverScrollNotificationWidgetState(this._controller);

  ///[ScrollStartNotification] 部件开始滑动
  ///[ScrollUpdateNotification] 部件位置发生改变
  ///[OverscrollNotification] 表示窗口小部件未更改它的滚动位置，因为更改会导致滚动位置超出其滚动范围
  ///[ScrollEndNotification] 部件停止滚动
  ///之所以不能使用这个来build或者layout，是因为这个通知的回调是会有延迟的。
  ///Any attempt to adjust the build or layout based on a scroll notification would
  ///result in a layout that lagged one frame behind, which is a poor user experience.
  @override
  Widget build(BuildContext context) {
    final Widget child = NotificationListener<ScrollStartNotification>(
      key: _key,
      child: NotificationListener<ScrollUpdateNotification>(
        child: NotificationListener<OverscrollNotification>(
          child: NotificationListener<ScrollEndNotification>(
            child: widget.child,
            onNotification: (ScrollEndNotification notification) {
              _controller.updateDragDistance(
                  0.0, ScrollNotificationListener.end);
              return false;
            },
          ),
          onNotification: (OverscrollNotification notification) {
            if (notification.dragDetails != null &&
                notification.dragDetails.delta != null) {
              _controller.updateDragDistance(notification.dragDetails.delta.dy,
                  ScrollNotificationListener.edge);
            }
            return false;
          },
        ),
        onNotification: (ScrollUpdateNotification notification) {
          return false;
        },
      ),
      onNotification: (ScrollStartNotification scrollUpdateNotification) {
        _controller.updateDragDistance(0.0, ScrollNotificationListener.start);
        return false;
      },
    );

    return child;
  }
}
