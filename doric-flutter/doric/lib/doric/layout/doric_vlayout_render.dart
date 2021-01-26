import 'dart:math';
import 'package:flutter/material.dart';
import 'package:doric/doric/shader/doric_gravity.dart';

import 'doric_multi_child_layout_render.dart';
import 'doric_node_data.dart';

class DoricVLinearRender extends DoricMultiChildLayoutRender {
  DoricVLinearRender({DoricNodeData data}) : super(data: data);
  double contentHeight = 0.0;

  @override
  void onMeasure() {
    super.onMeasure();
    double contentWidth = 0.0;
    double contentWeight = 0.0;
    var measureSize;
    if (!sizedByParent) {
      measureSize = Size(constraintMaxWidth, constraintMaxHeight);
    } else {
      measureSize = size;
    }
    if (childCount >= 2) {
      contentHeight = (childCount - 1) * data.spacing;
    }
    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      if (childData.weight > 0) {
        contentWeight += childData.weight;
        contentHeight += childData.verticalMargin();
      } else {
        var maxWidth = measureSize.width -
            data.horizontalPadding() -
            childData.horizontalMargin();
        var maxHeight = measureSize.height -
            contentHeight -
            data.verticalPadding() -
            childData.verticalMargin();
        if (maxWidth <= 0) {
          maxWidth = double.minPositive;
        }
        if (maxHeight <= 0) {
          maxHeight = double.minPositive;
        }
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
        contentHeight += (child.size.height + childData.verticalMargin());
        contentWidth =
            max(contentWidth, child.size.width + childData.horizontalMargin());
      }
    });

    double remainHeight = measureSize.height - contentHeight;

    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      if (childData.weight > 0) {
        BoxConstraints childBoxConstraints = BoxConstraints(
            maxWidth: measureSize.width -
                childData.horizontalMargin() -
                data.horizontalPadding(),
            maxHeight: remainHeight / contentWeight * childData.weight);
        childData.heightSpec = DoricLayoutSpec.DoricLayoutMost;
        child.layout(childBoxConstraints, parentUsesSize: true);
        contentHeight += (child.size.height + childData.verticalMargin());
        contentWidth =
            max(contentWidth, child.size.width + childData.horizontalMargin());
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
    var yStart = 0.0;
    if (gravity.isTop()) {
      yStart = data.paddingTop;
    } else if (gravity.isBottom()) {
      yStart = size.height - contentHeight - data.paddingBottom;
    } else if (gravity.isCenterY()) {
      yStart =
          (size.height - contentHeight - data.paddingTop - data.paddingBottom) /
                  2 +
              data.paddingTop;
    }

    visitDoricChildren((RenderBox child, int index, DoricNodeData childData,
        DoricMultiChildLayoutParentData parentData) {
      var childGravity =
          new DoricGravity(gravity.gravity | childData.alignment);
      var offsetY = yStart + childData.marginTop;
      var offsetX = data.paddingLeft + childData.marginLeft;
      if (childGravity.isLeft()) {
        offsetX = data.paddingLeft + childData.marginLeft;
      } else if (childGravity.isRight()) {
        offsetX = size.width -
            data.paddingRight -
            childData.marginRight -
            child.size.width;
      } else if (childGravity.isCenterX()) {
        offsetX = size.width / 2 -
            child.size.width / 2 -
            childData.marginLeft +
            childData.marginRight;
      }
      parentData.offset = Offset(offsetX, offsetY);
      yStart = parentData.offset.dy + child.size.height + data.spacing;
    });

  }
}
