import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util

AnimatedImage {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Image"

    Rectangle {
        id: bg
        color: "transparent"
    }

    onSourceChanged: {
        console.log(tag, uuid + " onSourceChanged: " + this.source)
    }

    onStatusChanged: {
        if (this.status === Image.Null) {
            console.log(tag, uuid + " onStatusChanged: Image.Null")
            imageBridge.onNull(wrapper);
        } else if (this.status === Image.Ready) {
            console.log(tag, uuid + " onStatusChanged: Image.Ready")

            if (this.width !== 0 && this.height !== 0 && this.status === Image.Ready) {
                imageBridge.onReady(wrapper);
            }
        } else if (this.status === Image.Loading) {
            console.log(tag, uuid + " onStatusChanged: Image.Loading")
            imageBridge.onLoading(wrapper);
        } else if (this.status === Image.Error) {
            console.log(tag, uuid + " onStatusChanged: Image.Error")
            imageBridge.onError(wrapper);
        }
    }

    onProgressChanged: {
        console.log(tag, uuid + " onProgressChanged: " + this.progress)
    }

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
        bg.width = this.width

        if (this.width !== 0 && this.height !== 0 && this.status === Image.Ready) {
            imageBridge.onReady(wrapper);
        }
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
        bg.height = this.height

        if (this.width !== 0 && this.height !== 0 && this.status === Image.Ready) {
            imageBridge.onReady(wrapper);
        }
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

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }
}
