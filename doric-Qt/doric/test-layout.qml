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

        RowLayout {
            spacing: 0
            Rectangle {
                width: 100
                height: 100
                color: 'black'
                Layout.alignment: Qt.AlignTop | Qt.AlignLeft
            }
            Rectangle {
                Layout.topMargin: 30
                width: 100
                height: 100
                color: 'yellow'
            }
            Rectangle {
                Layout.topMargin: 0
                width: 100
                height: 100
                color: 'black'
                Layout.alignment: Qt.AlignTop | Qt.AlignLeft
            }
            Rectangle {
                width: 100
                height: 100
                color: 'yellow'
            }
            Rectangle {
                width: 100
                height: 100
                color: 'black'
            }
            Rectangle {
                width: 100
                height: 100
                color: 'yellow'
            }
        }
    }
}
