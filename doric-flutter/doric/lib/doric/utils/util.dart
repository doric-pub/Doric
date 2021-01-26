import 'dart:ui';

import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/utils/log.dart';
import 'package:doric/flutter_jscore.dart';

class DoricUtils {

  static String format(String source, List<String> args) {
    String result = source;
    int tempIndex = result.indexOf("%s");
    int index = 0;
    while (tempIndex != -1 && index < args.length) {
      result = result.replaceFirst("%s", args[index]);
      tempIndex = result.indexOf("%s");
      index++;
    }
    return result;
  }

  static Future<String> readFile(String fileName)async{
    return rootBundle.loadString(fileName);
  }

  static String resolveBase64Img(String input){
    const regStr="data:image/(\\S+?);base64,(\\S+)";
    var reg=RegExp(regStr);
    if(reg.hasMatch(input)){
     String type= reg.firstMatch(input).group(1);
     String base64= reg.firstMatch(input).group(2);
     if(type.isNotEmpty&&base64.isNotEmpty){
       return base64;
     }
    }
    return "";
  }



  static double getScreenWidth() {
      return window.physicalSize.width/getDevicePixelRatio();

  }

  static double getScreenHeight() {
    return window.physicalSize.height/getDevicePixelRatio();
  }


  static double getDevicePixelRatio() {
    return window.devicePixelRatio;
  }


  static double getDeviceTop() {
    return window.padding.top/getDevicePixelRatio();
  }

  static double getDeviceBottom() {
    return window.padding.bottom/getDevicePixelRatio();
  }


  static JSValue dart2JS(DoricContext doricContext,result){
    var jsContext=doricContext.getJSContext();
    if(result is num){
      return JSValue.makeNumber(jsContext, result.toDouble());
    }else if(result is bool){
      return JSValue.makeBoolean(jsContext, result);
    }else if(result is String){
      return  JSValue.makeString(jsContext, result);
    }else if(result!=null){
      return JSValue.makeFromObject(jsContext, result);
    }
    return JSValue.makeNull(jsContext);
  }

}


class DeviceUtils {


}


