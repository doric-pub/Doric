import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/flutter_jscore.dart';

class InputNode extends ViewNode<InputWidget> {
  InputNode(DoricContext context) : super(context);

  @override
  InputWidget build(Map props) {
    return InputWidget(props, this);
  }
}

class InputWidget extends StatefulWidget {
  Map props;
  InputNode node;

  InputWidget(this.props, this.node);

  @override
  State<StatefulWidget> createState() {
    return _InputState();
  }
}

class _InputState extends State<InputWidget> {
  FocusNode _focusNode = new FocusNode();

  @override
  void initState() {
    super.initState();
    _focusNode.addListener(_focusNodeListener);
    widget.node.registerFunc("releaseFocus", releaseFocus);
  }

  @override
  void dispose() {
    super.dispose();
    _focusNode.unfocus();
    _focusNode.removeListener(_focusNodeListener);
  }

  void releaseFocus(JSValue jsValue,DoricPromise promise){
    _focusNode.unfocus();
  }

  Future<Null> _focusNodeListener() async {
    if (widget.props["onFocusChange"] != null) {
      widget.node.callJSResponse(widget.props["onFocusChange"], [
        JSValue.makeBoolean(
            widget.node.getDoricContext().getJSContext(), _focusNode.hasFocus)
      ]);
    }
  }

  bool boxDecoration() {
    return false;
  }



  TextAlign getAlign(props) {
//    if (props["textAlignment"] == null) {
      return TextAlign.start;
//    }
//    var gravity = Gravity((props["textAlignment"].toInt()) | Gravity.CENTER_Y);
//    if (gravity.isLeft()) {
//      return TextAlign.left;
//    } else if (gravity.isRight()) {
//      return TextAlign.right;
//    } else if (gravity.isCenterX()) {
//      return TextAlign.center;
//    }
//    return TextAlign.start;
  }

  @override
  Widget build(BuildContext context) {
    var props = widget.props;
    var border, borderView;
    var leftTopCorner = Radius.zero;
    var rightTopCorner = Radius.zero;
    var leftBottomCorner = Radius.zero;
    var rightBottomCorner = Radius.zero;
    //圆角
    if (props["corners"] != null) {
      var corners = props["corners"];
      if (corners is double) {
        leftTopCorner = rightTopCorner =
            leftBottomCorner = rightBottomCorner = Radius.circular(corners);
      } else if (corners != null) {
        leftTopCorner = Radius.circular(corners["leftTop"]);
        rightTopCorner = Radius.circular(corners["rightTop"]);
        rightBottomCorner = Radius.circular(corners["rightBottom"]);
        leftBottomCorner = Radius.circular(corners["leftBottom"]);
      }
    }
    var radius = BorderRadius.only(
        bottomLeft: leftBottomCorner,
        bottomRight: rightBottomCorner,
        topLeft: leftTopCorner,
        topRight: rightTopCorner);
    if (props["border"] != null) {
      var borderProps = props["border"];
      border = BorderSide(
          color: Color(borderProps["color"].toInt()),
          width: borderProps["width"]);
    } else {
      border = BorderSide.none;
    }
    borderView = OutlineInputBorder(
      borderSide: border,
      borderRadius: radius
    );

    return TextField(
      onChanged: (text) => {
        if (props["onTextChange"] != null)
          {
            widget.node.callJSResponse(props["onTextChange"], [
              JSValue.makeString(
                  widget.node.getDoricContext().getJSContext(), text)
            ])
          }
      },
      focusNode: _focusNode,
      maxLength: (props["maxLength"] ?? double.maxFinite).toInt(),
      decoration: InputDecoration(
        border: InputBorder.none, // 去掉下滑线
        counterText: '',  // 去除输入框底部的字符计数
        hintText: widget.props["hintText"],
        hintStyle: TextStyle(
          color: props["hintTextColor"] != null
              ? Color(props["hintTextColor"].toInt())
              : null,
        ),
      ),
      textAlign: getAlign(props),
      style: TextStyle(
          color: props["textColor"] != null
              ? Color(props["textColor"].toInt())
              : null,
          fontSize: props["textSize"] ?? 12),
    );
  }
}
