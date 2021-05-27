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
            model: 18
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
                                    return "EffectsDemo.js"
                                case 3:
                                    return "Gobang.js"
                                case 4:
                                    return "ImageDemo.js"
                                case 5:
                                    return "InputDemo.js"
                                case 6:
                                    return "LayoutDemo.js"
                                case 7:
                                    return "LayoutTestDemo.js"
                                case 8:
                                    return "ModalDemo.js"
                                case 9:
                                    return "ModularDemo.js"
                                case 10:
                                    return "NetworkDemo.js"
                                case 11:
                                    return "PopoverDemo.js"
                                case 12:
                                    return "ScrollerDemo.js"
                                case 13:
                                    return "SimpleDemo.js"
                                case 14:
                                    return "Snake.js"
                                case 15:
                                    return "StorageDemo.js"
                                case 16:
                                    return "SwitchDemo.js"
                                case 17:
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
