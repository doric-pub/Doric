import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

Rectangle {
    width: childrenRect.width
    height: childrenRect.height
    color: "#bb000000"

    ColumnLayout {
        Text {
            text: "toast"
            font.pixelSize: 20
            color: 'white'
            Layout.leftMargin: 5
            Layout.rightMargin: 5
            Layout.topMargin: 15
            Layout.bottomMargin: 15
        }
    }
}

