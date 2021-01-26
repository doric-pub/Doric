import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/group_node.dart';
import 'package:doric/doric/shader/view_node.dart';

class VLayoutNode<T extends Widget> extends GroupNode<Widget> {
  VLayoutNode(DoricContext context) : super(context);

  @override
  Widget build(Map props) {
    return DoricVLayout(data:DoricNodeData(props),children: this.getChildWidgets(),);
  }
}

