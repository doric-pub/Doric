import QtQuick 2.0
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 450
    height: 800
    title: qsTr("Scroll")

    Rectangle {
        color: 'red'
        width: childrenRect.width
        height: childrenRect.height

        ColumnLayout {
            spacing: 0
            width: 400

            Rectangle {
                Layout.alignment: Qt.AlignHCenter
                width: 100
                height: 100
                color: 'black'
            }

            Rectangle {
                Layout.alignment: Qt.AlignHCenter
                width: 100
                height: 100
                color: 'yellow'
            }
        }
    }
}
