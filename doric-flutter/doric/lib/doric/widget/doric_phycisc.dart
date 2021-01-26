import 'package:flutter/cupertino.dart';

class DoricScrollableScrollPhysics extends ClampingScrollPhysics {
  bool scrollable = true;

  DoricScrollableScrollPhysics({ScrollPhysics parent}) : super(parent: parent);

  @override
  DoricScrollableScrollPhysics applyTo(ScrollPhysics ancestor) {
    return DoricScrollableScrollPhysics(parent: buildParent(ancestor));
  }

  setScrollable(bool scroll) {
    scrollable = scroll;
  }

  @override
  bool shouldAcceptUserOffset(ScrollMetrics position) => scrollable?super.shouldAcceptUserOffset(position):false;

  @override
  bool get allowImplicitScrolling => scrollable;
}
