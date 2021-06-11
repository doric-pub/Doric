import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util

ListView {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "List"

    Rectangle {
        id: bg
        color: 'transparent'
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

    property var borderWidth: 0
    onBorderWidthChanged: {
        bg.border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        bg.border.color = borderColor
    }

    onCurrentIndexChanged: {
        console.log(tag, uuid + " onCurrentIndexChanged: " + this.currentIndex)
    }

}
