import 'dart:math';

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:doric/doric/layout/doric_scroller_wrap_render.dart';
import 'package:doric/doric/layout/doric_single_child_layout_render.dart';
import 'package:doric/doric/utils/log.dart';

import 'doric_decoration.dart';
import 'doric_node_data.dart';

abstract class IDoricRenderBox {
  DoricNodeData data;

  ParentData parentData;
}

//确定
abstract class DoricRenderBox extends RenderBox with IDoricRenderBox {
  DoricNodeData _data;
  bool _parentIsScroller;
  DoricRenderBox _parentRenderBox;
  DoricBoxDecoration boxDecoration;
  bool _initParent = false;

  DoricRenderBox({@required DoricNodeData data}) {
    assert(data != null);
    _data = data;
    createBoxDecoration();
  }

  void createBoxDecoration() {
    boxDecoration = DoricBoxDecoration(data.decorationData);
  }

  @override
  bool hitTestSelf(Offset position) {
    return true;
  }

  @override
  bool get isRepaintBoundary => true;

  DoricNodeData get data => _data;

  bool shouldParentNodeUpdate(DoricNodeData value) {
    if (value.marginBottom == data.marginBottom &&
        value.marginTop == data.marginTop &&
        value.marginLeft == data.marginLeft &&
        value.marginRight == data.marginRight) {
      return false;
    }
    return true;
  }

  bool shouldContainerUpdate(DoricNodeData value) {
    if (value.paddingLeft == data.paddingLeft &&
        value.paddingRight == data.paddingRight &&
        value.paddingTop == data.paddingTop &&
        value.paddingBottom == data.paddingBottom &&
        value.width == data.width &&
        value.height == data.height) {
      return false;
    }
    return true;
  }

  set data(DoricNodeData value) {
    assert(value != null);
    if (_data != value) {
      var parentUpdate = shouldParentNodeUpdate(value);
      var containerUpdate = true; //shouldContainerUpdate(value);
      _data = value;
      _painter?.dispose();
      _painter = null;
      _reset();
      createBoxDecoration();
      if (parentUpdate && parentRenderBox != null) {
        parentRenderBox.markNeedsLayout();
        parentRenderBox.markNeedsPaint();
      }
      if (containerUpdate && parent is RenderBox) {
        (parent as RenderBox).markNeedsLayout();
        (parent as RenderBox).markNeedsPaint();
      }
      markNeedsLayout();
      markNeedsPaint();
    }
  }

  _reset() {
    _initParent = false;
    _parentIsScroller = null;
    _parentRenderBox = null;
    _constraintMaxHeight = null;
    _constraintMaxWidth = null;
  }

  double _constraintMaxWidth;

  double get constraintMaxWidth {
    if (_constraintMaxWidth != null) {
      return _constraintMaxWidth;
    }
    if (parentIsScroller) {
      if (data.widthMost()) {
        _constraintMaxWidth =
            (parentRenderBox.parentRenderBox.constraintMaxWidth -
                parentRenderBox.data.horizontalPadding());
        if (_constraintMaxWidth <= 0) {
          _constraintMaxWidth = double.minPositive;
        }
        return _constraintMaxWidth;
      }
    }

    if (data.widthMost()) {
      if (parentRenderBox == null) {
        return _constraintMaxWidth = constraints.maxWidth;
      }
       _constraintMaxWidth = (parentRenderBox.constraintMaxWidth -
          parentRenderBox.data.horizontalPadding());
      if (_constraintMaxWidth <= 0) {
        _constraintMaxWidth = double.minPositive;
      }
      return _constraintMaxWidth;
    }
    if (data.widthJust()) {
      _constraintMaxWidth = data.width - data.horizontalPadding();
      if (_constraintMaxWidth <= 0) {
        _constraintMaxWidth = double.minPositive;
      }
      return _constraintMaxWidth;
    }
    return _constraintMaxWidth = constraints.maxWidth;
  }

  double _constraintMaxHeight;

  double get constraintMaxHeight {
    if (_constraintMaxHeight != null) {
      return _constraintMaxHeight;
    }
    if (parentIsScroller) {
      if (data.heightMost()) {
         _constraintMaxHeight =
            (parentRenderBox.parentRenderBox.constraintMaxHeight -
                parentRenderBox.parentRenderBox.data.verticalPadding());
        if(_constraintMaxHeight<=0){
          _constraintMaxHeight=double.minPositive;
        }
        return _constraintMaxHeight;
      }
    }
    if (data.heightMost()) {
      if (parentRenderBox == null) {
        return _constraintMaxHeight = constraints.maxHeight;
      }
       _constraintMaxHeight = (parentRenderBox.constraintMaxHeight -
          parentRenderBox.data.verticalPadding());
      if(_constraintMaxHeight<=0){
        _constraintMaxHeight=double.minPositive;
      }
      return _constraintMaxHeight;
    }
    if (data.heightJust()) {
       _constraintMaxHeight = data.height - data.verticalPadding();
       if(_constraintMaxHeight<=0){
         _constraintMaxHeight=double.minPositive;
       }
       return _constraintMaxHeight;
    }
    return _constraintMaxHeight = constraints.maxHeight;
  }

  @mustCallSuper
  @override
  void performLayout() {
    onMeasure();
    onLayout();
    data.size = size;
  }

  void onMeasure() {}

  void onLayout() {}

  DoricRenderBox get parentRenderBox {
    if (_initParent) {
      return _parentRenderBox;
    }
    var theParent = parent;
    while (theParent != null && theParent is! DoricRenderBox) {
      theParent = theParent.parent;
      if (theParent != null &&
          theParent.toString().contains("RenderClipRect")) {
        _parentIsScroller = true;
      }
      if (theParent is DoricRenderBox) {
        _parentRenderBox = theParent;
      }
    }
    _initParent = true;
    return _parentRenderBox;
  }

  bool get parentIsScroller {
    if (_parentIsScroller != null) {
      return _parentIsScroller;
    }
    var theParent = parent;
    while (theParent != null && theParent is! DoricRenderBox) {
      theParent = theParent.parent;
      if (theParent != null &&
          theParent.toString().contains("RenderClipRect")) {
        _parentIsScroller = true;
      }
    }
    if (_parentIsScroller != true) {
      _parentIsScroller = false;
    }

    return _parentIsScroller;
  }

  @override
  void performResize() {
    double width = data.widthSpec == DoricLayoutSpec.DoricLayoutJust
        ? data.width
        : constraintMaxWidth;
    double height = data.heightSpec == DoricLayoutSpec.DoricLayoutJust
        ? data.height
        : constraintMaxHeight;
    size = constraints.constrain(Size(width, height));
    size = data.constrain(size);
    data.measuredHeight = size.height;
    data.measuredWidth = size.width;
  }

  BoxPainter _painter;

  void beforePaint(PaintingContext context, Offset offset) {
    if (boxDecoration != null) {
      var decoration = boxDecoration.getDecoration();
      _painter ??= decoration.createBoxPainter(markNeedsPaint);
      final ImageConfiguration filledConfiguration =
          ImageConfiguration.empty.copyWith(size: size);
      _painter.paint(context.canvas, offset, filledConfiguration);
      if (decoration.isComplex) context.setIsComplexHint();
    }
  }

  void onPaint(PaintingContext context, Offset offset) {}

  void afterPaint(PaintingContext context, Offset offset) {}

  @override
  void paint(PaintingContext context, Offset offset) {
    if(!data.hidden){
      beforePaint(context, offset);
      onPaint(context, offset);
      afterPaint(context, offset);
    }
  }

  @override
  void setupParentData(RenderObject child) {
    if (child.parentData is! DoricMultiChildLayoutParentData) {
      child.parentData = DoricMultiChildLayoutParentData();
    }
  }

  @override
  bool get sizedByParent =>
      (data.widthSpec == DoricLayoutSpec.DoricLayoutJust ||
          (data.widthSpec == DoricLayoutSpec.DoricLayoutMost)) &&
      (data.heightSpec == DoricLayoutSpec.DoricLayoutJust ||
          (data.heightSpec == DoricLayoutSpec.DoricLayoutMost));

  Size defaultComputeSize(Size intrinsicSize) {
    double finalWidth = data.width, finalHeight = data.height;
    if (data.widthSpec == DoricLayoutSpec.DoricLayoutFit) {
      finalWidth = intrinsicSize.width + data.horizontalPadding();
    } else if (data.widthSpec == DoricLayoutSpec.DoricLayoutMost) {
      finalWidth = constraintMaxWidth;
    }
    if (data.heightSpec == DoricLayoutSpec.DoricLayoutFit) {
      finalHeight = intrinsicSize.height + data.verticalPadding();
    } else if (data.heightSpec == DoricLayoutSpec.DoricLayoutMost) {
      finalHeight = constraintMaxHeight;
    }

    return constraints.constrain(data.constrain(Size(finalWidth, finalHeight)));
  }

}
