import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/group_node.dart';

class StackNode<T extends Widget> extends GroupNode<Widget> {
  StackNode(DoricContext context) : super(context);

  @override
  Widget build(Map props) {
    return DoricStack(data:DoricNodeData(props),children: this.getChildWidgets(),);
  }
}

