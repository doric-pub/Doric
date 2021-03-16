import QtQuick 2.12
import QtQuick.Controls 2.5
import "util.mjs" as Util

Rectangle {
    property var uuid: Util.uuidv4()
    property int childrenRectWidth: childrenRect.width
    property int childrenRectHeight: childrenRect.width
    color: 'transparent'

    property var tag: "Text"

    onWidthChanged: () => {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: () => {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onChildrenRectChanged: () => {
        console.log(tag, uuid + " childrenRect: " + uuid + " onChildrenRectChanged: " +childrenRect)
        this.childrenRectWidth = childrenRect.width
        this.childrenRectHeight = childrenRect.height

        if (this.width === 0) {
            this.width = this.childrenRectWidth
        }
        if (this.height === 0) {
            this.height = this.childrenRectHeight
        }
    }

    Text {

    }
}
