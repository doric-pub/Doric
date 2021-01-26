import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/view_node.dart';

class TextNode extends ViewNode<Widget> {
  TextNode(DoricContext context) : super(context);

  @override
  Widget build(Map props) {
    return DoricTextWidget(
      data: DoricTextNodeData(props),
      child: TextWidget(props),
    );
  }
}

// ignore: must_be_immutable
class TextWidget extends StatelessWidget {
  Map props;

  TextWidget(this.props);


  TextOverflow getTextOverflow(){
    var truncateAt=(props["truncateAt"]??0.0);
    if(truncateAt==3){
      return TextOverflow.clip;
    }
    return TextOverflow.ellipsis;
  }

  FontStyle getFontStyle() {
    String fontStyle = props["fontStyle"];
    if (fontStyle == null) {
      return FontStyle.normal;
    }
    if (fontStyle.contains("italic")) {
      return FontStyle.italic;
    }
    return FontStyle.normal;
  }

  FontWeight getFontWeight() {
    String fontStyle = props["fontStyle"];
    if (fontStyle == null) {
      return FontWeight.normal;
    }
    if (fontStyle.contains("bold")) {
      return FontWeight.bold;
    }
    return FontWeight.normal;
  }

  TextDecoration getTextDecoration() {
    var underline = props["underline"] ?? false;
    var strikethrough = props["strikethrough"] ?? false;
    if (underline && strikethrough) {
      return TextDecoration.combine(
          [TextDecoration.underline, TextDecoration.lineThrough]);
    }
    if (underline) {
      return TextDecoration.underline;
    }
    if (strikethrough) {
      return TextDecoration.lineThrough;
    }
    return TextDecoration.none;
  }

  getFont() {
    var font = props["font"];
    if (font is String) {
      return font.replaceAll(".ttf", "").replaceAll("fonts/", "");
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    var maxLines = (props["maxLines"] ?? 1).toInt();
    var textSize = props["textSize"] ?? 12.0;
    var shadow = props["shadow"];

    var boxShadow;
    if (shadow != null) {
      boxShadow = [
        BoxShadow(
            color: Color(shadow["color"].toInt()),
            offset: Offset(shadow["offsetX"], shadow["offsetY"]),
            blurRadius: shadow["radius"])
      ];
    }
    return Text(
      props["text"] ?? "",
      style: TextStyle(
          fontFamily: getFont(),
          decoration: getTextDecoration(),
          color: props["textColor"] != null
              ? Color(props["textColor"].toInt())
              : null,
          height: 1,
          fontSize: textSize,
          fontStyle: getFontStyle(),
          shadows: boxShadow,
          fontWeight: getFontWeight()),
      maxLines: maxLines > 0 ? maxLines : null,
      overflow: getTextOverflow(),
      softWrap: false,
    );
  }
}

