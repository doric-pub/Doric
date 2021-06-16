import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.14

import "util.mjs" as Util

ScrollView {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Scroller"

    ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
    ScrollBar.vertical.policy: ScrollBar.AlwaysOff

    clip: true

    background: Rectangle {
        id: bg
        color: 'transparent'
    }

    property var backgroundColor

    onBackgroundColorChanged: {
        bg.color = backgroundColor
    }

    property var borderWidth: 0
    onBorderWidthChanged: {
        bg.border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        bg.border.color = borderColor
    }

    onWidthChanged: {
        bg.implicitWidth = width
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: {
        bg.implicitHeight = height
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onImplicitWidthChanged: {
        console.log(tag, uuid + " onImplicitWidthChanged: " + this.implicitWidth)
    }

    onImplicitHeightChanged: {
        console.log(tag, uuid + " onImplicitHeightChanged: " + this.implicitHeight)
    }

    onContentWidthChanged: {
        console.log(tag, uuid + " onContentWidthChanged: " + this.contentWidth)
    }

    onContentHeightChanged: {
        console.log(tag, uuid + " onContentHeightChanged: " + this.contentHeight)
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }
}
