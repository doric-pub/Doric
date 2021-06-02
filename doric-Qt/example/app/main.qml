import QtQuick 2.12
import QtQuick.Controls 2.5

ApplicationWindow {
    visible: true
    width: 600
    height: 800
    title: qsTr("Scroll")

    ScrollView {
        anchors.fill: parent

        ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
        ScrollBar.vertical.policy: ScrollBar.AlwaysOff

        ListView {
            width: parent.width
            model: 21
            delegate: Rectangle {
                Column {
                    anchors.centerIn: parent
                    Text {
                        text: {
                            switch (index) {
                                case 0:
                                    return "ComponetDemo.js"
                                case 1:
                                    return "Counter.js"
                                case 2:
                                    return "DraggableDemo.js"
                                case 3:
                                    return "EffectsDemo.js"
                                case 4:
                                    return "FlexDemo.js"
                                case 5:
                                    return "Gobang.js"
                                case 6:
                                    return "ImageDemo.js"
                                case 7:
                                    return "InputDemo.js"
                                case 8:
                                    return "LayoutDemo.js"
                                case 9:
                                    return "LayoutTestDemo.js"
                                case 10:
                                    return "ModalDemo.js"
                                case 11:
                                    return "ModularDemo.js"
                                case 12:
                                    return "NetworkDemo.js"
                                case 13:
                                    return "PopoverDemo.js"
                                case 14:
                                    return "ScrollerDemo.js"
                                case 15:
                                    return "SimpleDemo.js"
                                case 16:
                                    return "SliderDemo.js"
                                case 17:
                                    return "Snake.js"
                                case 18:
                                    return "StorageDemo.js"
                                case 19:
                                    return "SwitchDemo.js"
                                case 20:
                                    return "TextDemo.js"
                            }
                        }
                    }
                }
                width: parent.width
                height: 60
                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        demoBridge.navigate(index)
                    }
                }
            }
        }
    }
}
