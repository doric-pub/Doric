import 'package:flutter/cupertino.dart';

//统一处理 背景,边框,圆角,阴影
class DoricDecorationData {
  Color backgroundColor;
  Gradient backgroundGradient;
  Border border;
  BoxShadow boxShadow;
  BorderRadius borderRadius;

  DoricDecorationData(Map map) {
    resolveBackground(map["backgroundColor"]);
    resolveBorder(map["border"]);
    resolveCorners(map["corners"]);
    resolveShadow(map["shadow"]);
  }

  resolveShadow(shadow) {
    if (shadow != null) {
      boxShadow = BoxShadow(
          color: Color(shadow["color"].toInt()),
          offset: Offset(shadow["offsetX"], shadow["offsetY"]),
          blurRadius: shadow["radius"]);
    }
  }

  resolveBorder(data) {
    if (data != null) {
      border =
          Border.all(color: Color(data["color"].toInt()), width: data["width"]);
    }
  }

  resolveCorners(data) {
    var leftTopCorner = Radius.zero;
    var rightTopCorner = Radius.zero;
    var leftBottomCorner = Radius.zero;
    var rightBottomCorner = Radius.zero;
    if (data is double) {
      leftTopCorner = rightTopCorner =
          leftBottomCorner = rightBottomCorner = Radius.circular(data);
    } else if (data != null) {
      leftTopCorner = Radius.circular(data["leftTop"] ?? 0);
      rightTopCorner = Radius.circular(data["rightTop"] ?? 0);
      rightBottomCorner = Radius.circular(data["rightBottom"] ?? 0);
      leftBottomCorner = Radius.circular(data["leftBottom"] ?? 0);
    }
    borderRadius = BorderRadius.only(
        bottomLeft: leftBottomCorner,
        bottomRight: rightBottomCorner,
        topLeft: leftTopCorner,
        topRight: rightTopCorner);
  }

  resolveBackground(background) {
    if (background is Map) {
      var colors = <Color>[];
      var locations;
      if (background["colors"] != null) {
        colors = (background["colors"] as List)
            .map((e) => Color(int.parse(e)))
            .toList();
      } else {
        colors = [
          Color(background["start"].toInt()),
          Color(background["end"].toInt())
        ];
      }
      if (background["locations"] != null) {
        locations = (background["locations"] as List)
            .map((e) => double.parse(e))
            .toList();
      }
      Alignment begin, end;
      /**
       *  /** draw the gradient from the top to the bottom */
          TOP_BOTTOM = 0,
          /** draw the gradient from the top-right to the bottom-left */
          TR_BL,
          /** draw the gradient from the right to the left */
          RIGHT_LEFT,
          /** draw the gradient from the bottom-right to the top-left */
          BR_TL,
          /** draw the gradient from the bottom to the top */
          BOTTOM_TOP,
          /** draw the gradient from the bottom-left to the top-right */
          BL_TR,
          /** draw the gradient from the left to the right */
          LEFT_RIGHT,
          /** draw the gradient from the top-left to the bottom-right */
          TL_BR,
       */
      switch (background["orientation"].toInt()) {
        case 0: //top-bottom
          begin = Alignment.topCenter;
          end = Alignment.bottomCenter;
          break;
        case 1: // TR_BL
          begin = Alignment.topRight;
          end = Alignment.bottomLeft;
          break;
        case 2:
          begin = Alignment.centerRight;
          end = Alignment.centerLeft;
          break;
        case 3:
          begin = Alignment.bottomRight;
          end = Alignment.topLeft;
          break;
        case 4:
          begin = Alignment.bottomCenter;
          end = Alignment.topCenter;
          break;
        case 5:
          begin = Alignment.bottomLeft;
          end = Alignment.topRight;
          break;
        case 6:
          begin = Alignment.centerLeft;
          end = Alignment.centerRight;
          break;
        case 7:
          begin = Alignment.topLeft;
          end = Alignment.bottomRight;
          break;
      }
      backgroundGradient = LinearGradient(
          colors: colors, begin: begin, end: end, stops: locations);
    } else if (background is double) {
      backgroundColor = Color(background.toInt());
    }
  }
}
