import 'dart:typed_data';
import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:doric/doric/doric_context.dart';
import 'package:doric/doric/layout/doric_node_data.dart';
import 'package:doric/doric/layout/doric_widget.dart';
import 'package:doric/doric/shader/view_node.dart';
import 'dart:convert';
import 'package:image/image.dart' as ThirdImage;
import 'package:doric/doric/utils/util.dart';
import 'package:doric/flutter_jscore.dart';

class ImageNode extends ViewNode {
  ImageNode(DoricContext context) : super(context);

  @override
  Widget build(Map props) {
    return DoricImageWidget(
      data: DoricNodeData(props),
      child: ImageWidget(this, props),
    );
  }
}

//图片的边框圆角处理和普通的不一样,需要自己处理
// ignore: must_be_immutable
class ImageWidget extends StatefulWidget {
  ImageNode node;

  Map props;

  _ImageState state;

  ImageWidget(this.node, this.props);

  @override
  State<StatefulWidget> createState() {
    return state = new _ImageState();
  }
}

class _ImageState extends State<ImageWidget> {
  Widget _image;
  bool isFirst = true;
  Size imgSize = Size(0, 0);
  double scale = 1.0;

  @override
  void initState() {
    super.initState();
    loadPlaceHold();
    getImage();
  }

  loadPlaceHold() {
    Image resultImage;
    var img;
    if (widget.props["placeHolderImageBase64"] != null) {
      img = widget.props["placeHolderImageBase64"];
      Uint8List bytes =
          Base64Decoder().convert(DoricUtils.resolveBase64Img(img));
      resultImage = Image.memory(bytes, fit: getFit());
    } else if (widget.props["placeHolderImage"] != null) {
      img = widget.props["placeHolderImage"];
      resultImage = Image.asset(
        "assets/" + img,
        fit: getFit(),
      );
    }
    if (resultImage != null) {
      setState(() {
        _image = resultImage;
      });
    }
  }

  void getImage() {
    Image resultImage;
    var img;
    if (widget.props["imageBase64"] != null) {
      img = widget.props["imageBase64"];
      Uint8List bytes =
          Base64Decoder().convert(DoricUtils.resolveBase64Img(img));
      ThirdImage.Image image = ThirdImage.decodeImage(bytes);

      resultImage = Image.memory(bytes);
    } else if (widget.props["imageRes"] != null) {
      img = widget.props["imageRes"];
      resultImage = Image.asset("assets/" + img);
    } else if (widget.props["imageUrl"] != null) {
      img = widget.props["imageUrl"];
      resultImage = Image.network(img);
    }
    if (resultImage != null) {
      var resolve = resultImage.image.resolve(ImageConfiguration.empty);
      resolve.addListener(ImageStreamListener(
          (imageInfo, __) {
            if (isFirst) {
              isFirst = false;
              loadMainImg(resultImage, imageInfo);
            }
          },
          onError: (dynamic exception, StackTrace stackTrace) {
            if (widget.props["loadCallback"] != null) {
              widget.node.callJSResponse(widget.props["loadCallback"], [
                JSValue.makeNull(widget.node.getDoricContext().getJSContext())
              ]);
            }
            //加载失败
            loadErrorImg();
          }));
    }
  }

  getScale() {
    return DoricUtils.getDevicePixelRatio() /
        (widget.props["imageScale"] ?? DoricUtils.getDevicePixelRatio());
  }

  //base64>res>path>url
  loadMainImg(Image resultImage, ImageInfo imageInfo) async {
    imgSize = Size(imageInfo.image.width * 1.0, imageInfo.image.height * 1.0);
    setState(() {
      _image = resultImage;
      // _image = RawImage(
      //     image: imageInfo.image,
      //     fit: getFit(),
      //     centerSlice: getCenterSlice(),
      //     width:getWidth(),
      //     height:getHeight());
      if (widget.props["loadCallback"] != null) {
        widget.node.callJSResponse(widget.props["loadCallback"], [
          JSValue.makeFromObject(widget.node.getDoricContext().getJSContext(), {
            "width": imageInfo.image.width,
            "height": imageInfo.image.height,
          })
        ]);
      }
    });
  }

//
  loadErrorImg() {
    Image resultImage;
    var img;
    if (widget.props["errorImageBase64"] != null) {
      img = widget.props["errorImageBase64"];
      Uint8List bytes =
          Base64Decoder().convert(DoricUtils.resolveBase64Img(img));
      resultImage = Image.memory(bytes, fit: getFit());
    } else if (widget.props["errorImage"] != null) {
      img = widget.props["errorImage"];
      resultImage = Image.asset(
        "assets/" + img,
        fit: getFit(),
      );
    }
    if (resultImage != null) {
      setState(() {
        _image = resultImage;
      });
    }
  }

  update() {
    this.setState(() {});
  }

  getCenterSlice() {
    var stretchInset = widget.props["stretchInset"];

    if (stretchInset == null) {
      return null;
    }
    var scale = getScale();
    var width = imgSize.width * scale;
    var height = imgSize.height * scale;
    var left = stretchInset["left"] * scale;
    var top = stretchInset["top"] * scale;
    var right = stretchInset["right"] * scale;
    var bottom = stretchInset["bottom"] * scale;
    var react = Rect.fromLTRB(left, top, width - right, height - bottom);
    return react;
  }

  getFit() {
    var scaleType = widget.props["scaleType"] ?? 0;
    var fit = BoxFit.fill;
    switch (scaleType.toInt()) {
      case 1:
        fit = BoxFit.contain;
        break;
      case 2:
        fit = BoxFit.cover;
        break;
    }
    return fit;
  }

  getWidth() {
    return widget.props["width"] ??
        imgSize.width / DoricUtils.getDevicePixelRatio() * getScale();
  }

  getHeight() {
    return widget.props["height"] ??
        imgSize.height / DoricUtils.getDevicePixelRatio() * getScale();
  }

  @override
  Widget build(BuildContext context) {
    var props = widget.props;

    var leftTopCorner = Radius.zero;
    var rightTopCorner = Radius.zero;
    var leftBottomCorner = Radius.zero;
    var rightBottomCorner = Radius.zero;
    var border;

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

    //边框
    if (props["border"] != null) {
      var borderProps = props["border"];
      border = BorderSide(
          color: Color(borderProps["color"].toInt()),
          width: borderProps["width"]);
    } else {
      border = BorderSide.none;
    }

    var radius = BorderRadius.only(
        bottomLeft: leftBottomCorner,
        bottomRight: rightBottomCorner,
        topLeft: leftTopCorner,
        topRight: rightTopCorner);

    return Card(
      shape: RoundedRectangleBorder(borderRadius: radius, side: border),
      color: Color((props['backgroundColor'] ?? 0).toInt()),
      clipBehavior: Clip.antiAlias,
      child: _image,
    );
  }
}
