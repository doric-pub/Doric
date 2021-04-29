import QtQuick 2.0
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 600
    height: 800
    title: qsTr("Scroll")

    ScrollView {
        property var wrapper

        width: 200
        height: 200

        ScrollBar.horizontal.policy: ScrollBar.AlwaysOn
        ScrollBar.vertical.policy: ScrollBar.AlwaysOn

        clip: true

//        property var uuid: Util.uuidv4()

        property var tag: "Scroller"

        background: Rectangle {
            id: bg
            color: 'red'
        }

        property var backgroundColor

        onBackgroundColorChanged: {
            bg.color = backgroundColor
        }

        onWidthChanged: {
            bg.implicitWidth = width
            console.log(tag, uuid + " onWidthChanged: " + this.width)
        }

        onHeightChanged: {
            bg.implicitHeight = height
            console.log(tag, uuid + " onHeightChanged: " + this.height)
        }

        Rectangle {
            implicitWidth: 400
            implicitHeight: 400

            Label {
                text: "ABC"
                font.pixelSize: 124
            }
        }
    }
}
