import 'dart:math';
import 'package:flutter/material.dart';
import 'package:doric/doric/shader/doric_gravity.dart';
import 'doric_multi_child_layout_render.dart';
import './doric_node_data.dart';

class DoricHLinearRender extends DoricMultiChildLayoutRender {
  DoricHLinearRender({DoricNodeData data}) : super(data: data);
  double contentWidth = 0.0;

  @override
  void onMeasure() {
    super.onMeasure();
    contentWidth = 0.0;
    double contentHeight = 0.0;
    double contentWeight = 0.0;
    Size measureSize;
    if (!sizedByParent) {
      measureSize = Size(constraintMaxWidth, constraintMaxHeight);
    } else {
      measureSize = size;
    }
    if (childCount >= 2) {
      contentWidth = (childCount - 1) * data.spacing;
    }
    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      if (childData.weight > 0) {
        contentWeight += childData.weight;
        contentWidth += childData.horizontalMargin();
      } else {
        var maxWidth = measureSize.width -
            contentWidth -
            data.horizontalPadding() -
            childData.horizontalMargin();
        var maxHeight = measureSize.height -
            data.verticalPadding() -
            childData.verticalMargin();
        if (!sizedByParent) {
          if (data.heightFit() && childData.heightMost()) {
            maxHeight = double.minPositive;
          }
          if (data.widthFit() && childData.widthMost()) {
            maxWidth = double.minPositive;
          }
        }
        BoxConstraints childBoxConstraints =
            BoxConstraints(maxWidth: maxWidth, maxHeight: maxHeight);

        child.layout(childBoxConstraints, parentUsesSize: true);
        contentWidth += (child.size.width + childData.horizontalMargin());
        contentHeight =
            max(contentHeight, child.size.height + childData.verticalMargin());
      }
    });

    double remainWidth = measureSize.width - contentWidth;
    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      if (childData.weight > 0) {
        BoxConstraints childBoxConstraints = BoxConstraints(
            maxWidth: remainWidth / contentWeight * childData.weight,
            maxHeight: measureSize.height -
                data.verticalPadding() -
                childData.verticalMargin());
        childData.widthSpec = DoricLayoutSpec.DoricLayoutMost;
        child.layout(childBoxConstraints, parentUsesSize: true);
        contentWidth += (child.size.width + childData.horizontalMargin());
        contentHeight =
            max(contentHeight, child.size.height + childData.verticalMargin());
      }
    });
    if (!sizedByParent) {
      size = defaultComputeSize(Size(contentWidth, contentHeight));
    }
  }

  @override
  void onLayout() {
    super.onLayout();
    var gravity = new DoricGravity((data.gravity ??
            (DoricGravity.DoricGravityLeft | DoricGravity.DoricGravityTop))
        .toInt());
    var xStart = 0.0;
    if (gravity.isLeft()) {
      xStart = data.paddingLeft;
    } else if (gravity.isRight()) {
      xStart = size.width - contentWidth - data.paddingRight;
    } else if (gravity.isCenterX()) {
      xStart =
          (size.width - contentWidth - data.paddingLeft - data.paddingRight) /
                  2 +
              data.paddingLeft;
    }

    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      var childGravity =
          new DoricGravity(gravity.gravity | childData.alignment);
      var offsetY = data.paddingTop + childData.marginTop;
      var offsetX = xStart + childData.marginLeft;
      if (childGravity.isTop()) {
        offsetY = data.paddingTop + childData.marginTop;
      } else if (childGravity.isBottom()) {
        offsetY = size.height -
            data.paddingBottom -
            childData.marginBottom -
            child.size.height;
      } else if (childGravity.isCenterY()) {
        offsetY = size.height / 2 -
            child.size.height / 2 -
            childData.marginTop +
            childData.marginBottom;
      }
      parentData.offset = Offset(offsetX, offsetY);
      xStart = parentData.offset.dx + child.size.width + data.spacing;
    });
  }
}
