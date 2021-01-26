import 'dart:math';

import 'package:flutter/cupertino.dart';
import 'package:flutter/rendering.dart';

import 'doric_node_data.dart';
import 'doric_renderbox.dart';

class DoricImageRender extends DoricRenderBox
    with RenderObjectWithChildMixin<RenderBox> {
  DoricImageRender({DoricNodeData data, Widget child}) : super(data: data);

  @override
  void createBoxDecoration() {
//    super.createBoxDecoration();
    boxDecoration = null;
  }

  @override
  void onMeasure() {
    BoxConstraints childBoxConstraints = computeChildBoxConstraints();
    if (sizedByParent) {
      child.layout(childBoxConstraints, parentUsesSize: true);
    } else {
      child.layout(childBoxConstraints, parentUsesSize: true);
      size = defaultComputeSize(child.size);
    }
  }

  @override
  bool get isRepaintBoundary => true;

  @override
  void onPaint(PaintingContext context, Offset offset) {
    if (child != null) {
      context.paintChild(
          child,
          offset +
              (child.parentData as DoricMultiChildLayoutParentData).offset);
    }
  }

  @override
  double computeMinIntrinsicWidth(double height) {
    final double totalHorizontalPadding = data.paddingLeft + data.paddingRight;
    final double totalVerticalPadding = data.paddingTop + data.paddingBottom;
    if (child != null) // next line relies on double.infinity absorption
      return child
              .getMinIntrinsicWidth(max(0.0, height - totalVerticalPadding)) +
          totalHorizontalPadding;
    return totalHorizontalPadding;
  }

  @override
  double computeMaxIntrinsicWidth(double height) {
    final double totalHorizontalPadding = data.paddingLeft + data.paddingRight;
    final double totalVerticalPadding = data.paddingTop + data.paddingBottom;
    if (child != null) // next line relies on double.infinity absorption
      return child
              .getMaxIntrinsicWidth(max(0.0, height - totalVerticalPadding)) +
          totalHorizontalPadding;
    return totalHorizontalPadding;
  }

  @override
  double computeMinIntrinsicHeight(double width) {
    final double totalHorizontalPadding = data.paddingLeft + data.paddingRight;
    final double totalVerticalPadding = data.paddingTop + data.paddingBottom;
    if (child != null) // next line relies on double.infinity absorption
      return child
              .getMinIntrinsicHeight(max(0.0, width - totalHorizontalPadding)) +
          totalVerticalPadding;
    return totalVerticalPadding;
  }

  @override
  double computeMaxIntrinsicHeight(double width) {
    final double totalHorizontalPadding = data.paddingLeft + data.paddingRight;
    final double totalVerticalPadding = data.paddingTop + data.paddingBottom;
    if (child != null) // next line relies on double.infinity absorption
      return child
              .getMaxIntrinsicHeight(max(0.0, width - totalHorizontalPadding)) +
          totalVerticalPadding;
    return totalVerticalPadding;
  }

  BoxConstraints computeChildBoxConstraints() {
    var maxHeight = data.measuredHeight ?? constraintMaxHeight;
    var maxWidth = data.measuredWidth ?? constraintMaxWidth;

    return BoxConstraints(
        minHeight: data.minHeight,
        minWidth: data.minWidth,
        maxHeight: maxHeight,
        maxWidth: maxWidth);
  }
}
