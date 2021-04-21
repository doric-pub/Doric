import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

Window {
    id: window

    flags: flags | Qt.WindowStaysOnTopHint  | Qt.Tool | Qt.FramelessWindowHint | Qt.WindowTransparentForInput

    color: "#bb000000"
    visible: true

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

        onWidthChanged: {
            window.width = implicitWidth
        }

        onHeightChanged: {
            window.height = implicitHeight
        }
    }
}

