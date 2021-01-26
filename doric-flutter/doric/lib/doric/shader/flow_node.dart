

import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/shader/group_node.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';

class DoricFlowLayoutNode extends SuperNode<Widget>{

  DoricFlowLayoutNode(DoricContext context) : super(context);

  @override
  Widget build(Map props) {
  }

  @override
  void blendSubNode(Map<dynamic, dynamic> subProperties) {
  }

  @override
  ViewNode<Widget> getSubNodeById(String id) {
  }

}