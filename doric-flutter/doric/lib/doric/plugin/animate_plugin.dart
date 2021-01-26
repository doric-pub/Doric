import 'dart:async';

import 'package:flutter/animation.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/doric_promise.dart';
import 'package:doric/doric/engine/doric_plugin.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/flutter_jscore.dart';

class AnimatePlugin extends DoricPlugin {
  var animations = [];

  AnimatePlugin(DoricContext context) : super(context);

  @override
  Map initFunc() {
    return {
      "animateRender": animateRender,
      "submit": submit,
    };
  }

  void submit(JSValue jsValue, DoricPromise promise) {
    promise.resolve([]);
  }

  void animateRender(JSValue jsValue, DoricPromise promise) {
    var data = jsValue.toObject().toMap();
    var viewId = data["id"];
    var rootNode = getDoricContext().getRoot();
    var duration = data["duration"].toInt();
    AnimationController animationController = AnimationController(
        duration: Duration(milliseconds: duration),
        vsync: getDoricContext().getRoot().getLayer().state);
    getDoricContext().setAnimationController(animationController);
    animations.add(animationController);
    rootNode.setId(viewId);
    rootNode.blend(data["props"]);
    getDoricContext().setAnimationController(null);
    animationController.addStatusListener((status) {
      if (status == AnimationStatus.completed) {
        promise.resolve([]);
        animationController.dispose();
        animations.remove(animationController);
      }
    });
    animationController.forward();
  }

  @override
  void onTearDown() {
    animations.forEach((animationController) {
      var animation=animationController as AnimationController;
      if(animation.isAnimating){
        animation.dispose();
      }
    });
    animations.clear();
  }
}
