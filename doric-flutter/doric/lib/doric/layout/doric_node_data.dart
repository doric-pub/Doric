import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:doric/doric/shader/doric_gravity.dart';
import 'doric_decoration_data.dart';

enum DoricLayoutType { DoricUndefined, DoricStack, DoricVLayout, DoricHLayout }
enum DoricLayoutSpec { DoricLayoutJust, DoricLayoutFit, DoricLayoutMost }

class DoricTextNodeData extends DoricNodeData {
  int textAlignment;

  DoricTextNodeData(Map props) : super(props) {
    textAlignment =
        (props["textAlignment"] ?? (DoricGravity.DoricGravityCenter * 1.0))
            .toInt();
  }
}

class DoricNodeData {
  DoricLayoutSpec widthSpec;
  DoricLayoutSpec heightSpec;
  double width;
  double height;
  double spacing;
  double marginLeft;
  double marginRight;
  double marginTop;
  double marginBottom;
  double paddingLeft;
  double paddingRight;
  double paddingTop;
  double paddingBottom;
  int weight;
  DoricLayoutType layoutType;
  bool disabled;
  double maxWidth;
  double maxHeight;
  double minWidth;
  double minHeight;
  double measuredWidth;
  double measuredHeight;
  double rotation;
  double rotationX;
  double rotationY;
  double scaleX;
  double scaleY;
  double pivotX;
  double pivotY;
  DoricDecorationData decorationData;
  String tag;
  Map props;
  int gravity;
  int alignment;
  Size size;
  double alpha;
  bool hidden;
  DoricNodeData(Map props) {
    props = props ?? {};
    this.props = props;
    var layoutConfig = props["layoutConfig"] ?? {};
    tag = props["tag"] ?? "";
    alpha = props["alpha"] ?? 1.0;
    hidden = props["hidden"] ?? false;
    scaleY = props["scaleY"] ?? 1.0;
    scaleX = props["scaleX"] ?? 1.0;
    pivotX = props["pivotX"] ?? 0.5;
    pivotY = props["pivotY"] ?? 0.5;
    rotation = props["rotation"] ?? 0.0;
    rotationX = props["rotationX"] ?? 0.0;
    rotationY = props["rotationY"] ?? 0.0;
    gravity = (props["gravity"] ?? 0.0).toInt();
    spacing = (props["space"] ?? 0.0);
    alignment = (layoutConfig["alignment"] ?? 0.0).toInt();
    weight = (layoutConfig["weight"] ?? 0.0).toInt();
    width = props["width"] ?? 0;
    minWidth = props["minWidth"] ?? double.minPositive;
    maxWidth = props["maxWidth"] ?? double.maxFinite;
    height = props["height"] ?? 0;
    minHeight = props["minHeight"] ?? double.minPositive;
    maxHeight = props["maxHeight"] ?? double.maxFinite;

    widthSpec =
        DoricLayoutSpec.values[(layoutConfig["widthSpec"] ?? 0.0).toInt()];
    heightSpec =
        DoricLayoutSpec.values[(layoutConfig["heightSpec"] ?? 0.0).toInt()];
    paddingRight = props["paddingRight"] ?? 0.0;
    paddingLeft = props["paddingLeft"] ?? 0.0;
    paddingTop = props["paddingTop"] ?? 0.0;
    paddingBottom = props["paddingBottom"] ?? 0.0;

    var margin = layoutConfig["margin"] ?? {};
    marginLeft = margin["left"] ?? 0.0;
    marginRight = margin["right"] ?? 0.0;
    marginTop = margin["top"] ?? 0.0;
    marginBottom = margin["bottom"] ?? 0.0;

    if (props["x"] != null) {
      marginLeft += props["x"];
    }
    if (props["translationX"] != null) {
      marginLeft += props["translationX"];
    }
    if (props["y"] != null) {
      marginTop += props["y"];
    }
    if (props["translationY"] != null) {
      marginTop += props["translationY"];
    }

    decorationData = DoricDecorationData(props);
  }

  Size constrain(Size targetSize) {
    Size size = BoxConstraints(
            maxWidth: maxWidth,
            minWidth: minWidth,
            maxHeight: maxHeight,
            minHeight: minHeight)
        .constrain(targetSize);
    return size;
  }

  Size removeMargin(Size targetSize) {
    return Size(targetSize.width - marginLeft - marginRight,
        targetSize.height - marginBottom - marginTop);
  }

  double horizontalPadding() {
    return paddingLeft + paddingRight;
  }

  double horizontalMargin() {
    return marginLeft + marginRight;
  }

  double verticalPadding() {
    return paddingTop + paddingBottom;
  }

  double verticalMargin() {
    return marginTop + marginBottom;
  }

  bool heightMost() {
    return heightSpec == DoricLayoutSpec.DoricLayoutMost;
  }

  bool heightFit() {
    return heightSpec == DoricLayoutSpec.DoricLayoutFit;
  }

  bool heightJust() {
    return heightSpec == DoricLayoutSpec.DoricLayoutJust;
  }

  bool widthMost() {
    return widthSpec == DoricLayoutSpec.DoricLayoutMost;
  }

  bool widthFit() {
    return widthSpec == DoricLayoutSpec.DoricLayoutFit;
  }

  bool widthJust() {
    return widthSpec == DoricLayoutSpec.DoricLayoutJust;
  }
}

class DoricMultiChildLayoutParentData
    extends ContainerBoxParentData<RenderBox> {}
