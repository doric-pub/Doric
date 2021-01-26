import 'dart:ffi';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:doric/doric/doric_panel.dart';

import 'doric/engine/doric_native_driver.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        // This is the theme of your application.
        //
        // Try running your application with "flutter run". You'll see the
        // application has a blue toolbar. Then, without quitting the app, try
        // changing the primarySwatch below to Colors.green and then invoke
        // "hot reload" (press "r" in the console where you ran "flutter run",
        // or simply save your changes to "hot reload" in a Flutter IDE).
        // Notice that the counter didn't reset back to zero; the application
        // is not restarted.
        primarySwatch: Colors.blue,
        // This makes the visual density adapt to the platform that you run
        // the app on. For desktop platforms, the controls will be smaller and
        // closer together (more dense) than on mobile platforms.
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: MyHomePage(title: ' Flutter Demo'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  MyHomePage({Key key, this.title}) : super(key: key);

  // This widget is the home page of your application. It is stateful, meaning
  // that it has a State object (defined below) that contains fields that affect
  // how it looks.

  // This class is the configuration for the state. It holds the values (in this
  // case the title) provided by the parent (in this case the App widget) and
  // used by the build method of the State. Fields in a Widget subclass are
  // always marked "final".

  final String title;

  @override
  _MyHomePageState createState() => _MyHomePageState();
}
class Test{
  b(){
    Row();
    Draggable(

    );
  }
}
class _MyHomePageState extends State<MyHomePage> {
  @override
  void initState() {
    super.initState();
    DoricNativeDriver.getInstance();
  }

  @override
  Widget build(BuildContext context) {
    var demos = [
      "Demo",
      "AnimatorDemo",
      "Counter",
      "EffectsDemo",
      "Gobang",
      "InputDemo",
      "LayoutDemo",
      "LayoutTestDemo",
      "PopoverDemo",
      "ImageDemo",
      "ModalDemo",
      "ListDemo",
      "ListDemo1",
      "TextDemo",
      "SwitchDemo",
      "Snake",
      "DraggableDemo",
      "NetworkDemo",
      "StorageDemo",
      "NavigatorDemo",
      "PathButtonDemo",
      "SliderDemo",
      "ScrolledSliderDemo",
      "NotchDemo",
      "ComplicatedDemo",
      "TextAnimationDemo",
    ];
    return Scaffold(
      appBar: AppBar(
        title: Text("Doric Flutter Demo"),
      ),
      body: Container(
        child: ListView(
          children: demos
              .map((e) => ListTile(
                    title: Text(e),
                    onTap: () {
                      Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => Scaffold(
                              appBar: AppBar(
                                title: Text(e),
                              ),
                              body: Container(
                                  color: Colors.white,
                                  child: DoricPanel({
                                    "source": 'assets://demo/' + e + '.js',
                                    "config": {"alias": e}
                                  })),
                            ),
                          ));
                    },
                  ))
              .toList(),
        ),
      )
    );
  }
}
