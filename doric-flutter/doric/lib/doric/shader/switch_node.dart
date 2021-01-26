import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/flutter_jscore.dart';

class SwitchNode extends ViewNode<SwitchWidget> {
  SwitchNode(DoricContext context) : super(context);

  @override
  SwitchWidget build(Map<dynamic, dynamic> props) {
    return SwitchWidget(this, props);
  }
}

class SwitchWidget extends StatefulWidget {
  ViewNode viewNode;
  Map props;

  SwitchWidget(this.viewNode, this.props);

  @override
  State<StatefulWidget> createState() {
    return _SwitchState();
  }
}

class _SwitchState extends State<SwitchWidget> {
  bool state = true;

  @override
  Widget build(BuildContext context) {
    var props = widget.props;
    return CupertinoSwitch(
      value: props["state"] ?? true,
      activeColor: props["onTintColor"]!=null?Color(props["onTintColor"].toInt()):null,
      trackColor: props["offTintColor"]!=null?Color(props["offTintColor"].toInt()):null,
      onChanged: (check) {
        setState(() {
          widget.props["state"] = check;
        });
        if (props["onSwitch"] != null) {
          widget.viewNode.callJSResponse(props["onSwitch"], [
            JSValue.makeBoolean(
                widget.viewNode.getDoricContext().getJSContext(), check)
          ]);
        }
      },
    );
  }
}
