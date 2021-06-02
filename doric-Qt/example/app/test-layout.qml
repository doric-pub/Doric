import QtQuick 2.0
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 600
    height: 800
    title: qsTr("Scroll")

    Rectangle {
        anchors.fill: parent

        Rectangle {
            id: root

            width: 200; height: 200
            color: "red"

            Drag.active: dragArea.drag.active

            MouseArea {
                id: dragArea
                anchors.fill: parent

                drag.target: parent

                onPositionChanged: {
                    var positionToParent = mapToItem(root.parent, mouse.x, mouse.y)
                    var positionToRoot = mapToItem(root, mouse.x, mouse.y)
                    console.log(positionToParent, positionToRoot)
                }
            }
        }
    }


}
