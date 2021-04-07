import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util
import "gravity.mjs" as Gravity

Rectangle {
    property var wrapper

    property var uuid: Util.uuidv4()
    property int childrenRectWidth: childrenRect.width
    property int childrenRectHeight: childrenRect.width
    color: 'transparent'

    property var tag: "Text"

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onChildrenRectChanged: {
        console.log(tag, uuid + " onChildrenRectChanged: " + childrenRect)
        this.childrenRectWidth = childrenRect.width
        this.childrenRectHeight = childrenRect.height

        if (this.width < this.childrenRectWidth) {
            this.width = this.childrenRectWidth
        }
        if (this.height < this.childrenRectHeight) {
            this.height = this.childrenRectHeight
        }
    }

    Text {
        property int textAlignment: 0

        onTextAlignmentChanged: {
            let gravity = Gravity.enumerate()
            let result = this.textAlignment | gravity.CENTER_Y
            console.log(tag, uuid + " onTextAlignmentChanged: " + this.textAlignment)
            switch(result) {
                case gravity.CENTER:
                    this.anchors.horizontalCenter = parent.horizontalCenter
                    this.anchors.verticalCenter = parent.verticalCenter
                    break
            }
        }
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }
}
