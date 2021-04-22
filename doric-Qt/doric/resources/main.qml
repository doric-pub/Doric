import QtQuick 2.12
import QtQuick.Controls 2.5

ApplicationWindow {
    visible: true
    width: 405
    height: 720
    title: qsTr("Scroll")

    ScrollView {
        anchors.fill: parent

        ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
        ScrollBar.vertical.policy: ScrollBar.AlwaysOff

        ListView {
            width: parent.width
            model: 7
            delegate: Rectangle {
                Column {
                    anchors.centerIn: parent
                    Text {
                        text: {
                            switch (index) {
                                case 0:
                                    return "Counter.js"
                                case 1:
                                    return "Gobang.js"
                                case 2:
                                    return "LayoutDemo.js"
                                case 3:
                                    return "ModalDemo.js"
                                case 4:
                                    return "PopoverDemo.js"
                                case 5:
                                    return "SimpleDemo.js"
                                case 6:
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
