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
            model: 11
            delegate: Rectangle {
                Column {
                    anchors.centerIn: parent
                    Text {
                        text: {
                            switch (index) {
                                case 0:
                                    return "Counter.js"
                                case 1:
                                    return "EffectsDemo.js"
                                case 2:
                                    return "Gobang.js"
                                case 3:
                                    return "ImageDemo.js"
                                case 4:
                                    return "LayoutDemo.js"
                                case 5:
                                    return "LayoutTestDemo.js"
                                case 6:
                                    return "ModalDemo.js"
                                case 7:
                                    return "NetworkDemo.js"
                                case 8:
                                    return "PopoverDemo.js"
                                case 9:
                                    return "SimpleDemo.js"
                                case 10:
                                    return "Snake.js"
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
