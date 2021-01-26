import 'package:flutter/cupertino.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/shader/doric_root.dart';
import 'package:doric/doric/shader/super_node.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/doric/utils/util.dart';

abstract class GroupNode<T extends Widget> extends SuperNode<T> {
  List<ViewNode> mChildNodes = [];
  List<String> mChildViewIds = [];

  GroupNode(DoricContext context) : super(context);

  bool childChanged=false;

  @override
  void beforeBlend(Map props) {
    childChanged=false;
    if (props["children"] is List) {
      childChanged=true;
      mChildViewIds.clear();
      (props["children"] as List).forEach((element) {
        mChildViewIds.add(element);
      });
    }
    super.beforeBlend(props);
    if(childChanged){
      configChildNode();
    }
  }

  List<Widget> getChildWidgets() {
    List<Widget> list = [];
    mChildNodes.forEach((element) {
      if(mChildViewIds.contains(element.getId())){
        list.add(element.getNodeView());
      }
    });
    return list;
  }


  @override
  bool shouldUpdate() {
    return super.shouldUpdate()|childChanged;
  }

  void configChildNode() {
    for (var index = 0; index < mChildViewIds.length; index++) {
      String id = mChildViewIds[index];
      Map model = getSubModel(id);
      if (model == null) {
        DoricLog.e(DoricUtils.format(
            "configChildNode error when Group is %s and  child is %s",
            [this.getId(), id]));
        continue;
      }
      String type = model['type'];
      if (index < mChildNodes.length) {
        ViewNode oldNode = mChildNodes[index];
        if (oldNode.getType() != type) {
          ViewNode node = ViewNode.create(getDoricContext(), type);
          node.init(this);
          node.setId(model['id']);
          node.blend(model["props"]);
          mChildNodes[index] = node;
        }else{
          oldNode.setId(model['id']);
          oldNode.blend(model["props"],thisBlendProp: model["props"]);
        }
      } else {
        ViewNode node = ViewNode.create(getDoricContext(), type);
        node.init(this);
        node.setId(model['id']);
        node.blend(model["props"]);
        mChildNodes.add(node);
      }
    }
  }

  ViewNode getSubNodeById(String id) {
    for (ViewNode node in mChildNodes) {
      if (id == node.getId()) {
        return node;
      }
    }
    return null;
  }

  @override
  void blendSubNode(Map subProperties) {
    String subNodeId = subProperties["id"];
    for (var i = 0; i < mChildNodes.length; i++) {
      ViewNode node = mChildNodes[i];
      if (node.getId() == subNodeId) {
        node.blend(subNodes[subNodeId]["props"],forceUpdate: subviewChanged,thisBlendProp: subProperties["props"]);
      }
    }
  }
}
