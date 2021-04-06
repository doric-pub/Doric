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
            property int gravity: 0
            onGravityChanged: {
                console.log(children[0].Layout.alignment)
                children[0].Layout.alignment = 1
            }

            spacing: 0
            height: 600

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
