import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15
import QtGraphicalEffects 1.12

import "util.mjs" as Util

Rectangle {
    property var wrapper

    clip: true

    property var uuid: Util.uuidv4()

    property var tag: "HLayout"

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    color: 'transparent'

    property var backgroundColor

    onBackgroundColorChanged: {
        color = backgroundColor
    }

    property var borderWidth: 0
    onBorderWidthChanged: {
        border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        border.color = borderColor
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }

    property var shadowColor
    property var shadowRadius
    property var shadowOffsetX
    property var shadowOffsetY
    property var shadowOpacity

    onShadowOpacityChanged: {
        if (shadowOpacity > 0) {
            layer.enabled = true
        } else {
            layer.enabled = false
        }
    }

    layer.enabled: false
    layer.effect: DropShadow {
        horizontalOffset: shadowOffsetX
        verticalOffset: shadowOffsetY
        radius: shadowRadius
        samples: 16
        color: shadowColor
        transparentBorder: true
    }
}
