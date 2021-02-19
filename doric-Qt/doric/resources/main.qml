import QtQuick 2.12
import QtQuick.Controls 2.5

ApplicationWindow {
    visible: true
    width: 960
    height: 720
    title: qsTr("Scroll")

    ScrollView {
        anchors.fill: parent

        ListView {
            width: parent.width
            model: 1
            delegate: Rectangle {
                Column {
                    anchors.centerIn: parent
                    Text {
                        text: {return "Snake.js"}
                    }
                }
                width: parent.width
                height: 60
                MouseArea {
                    anchors.fill: parent
                    onClicked: {demoBridge.navigate(index)}
                }
            }
        }
    }
}
