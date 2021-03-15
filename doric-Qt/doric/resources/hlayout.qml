import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

import "util.mjs" as Util

Rectangle {
    property var uuid: Util.uuidv4()
    property int widthSpec: 0
    property int heightSpec: 0
    property int childrenRectWidth: childrenRect.width
    property int childrenRectHeight: childrenRect.height

    property var tag: "HLayout"

    onWidthChanged: () => {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: () => {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onWidthSpecChanged: () => {
        console.log(tag, uuid + " onWidthSpecChanged: " + this.widthSpec)
        console.log(tag, uuid + " parent width: " + parent.width)
        if (this.widthSpec === 2) {
            this.width = parent.width
        }
    }

    onHeightSpecChanged: () => {
        console.log(tag, uuid + " onHeightSpecChanged: " + this.heightSpec)
        console.log(tag, uuid + " parent height: " + parent.height)

        if (this.heightSpec === 2) {
            this.height = parent.height
        }
    }

    onChildrenRectChanged: () => {
        console.log(tag, uuid + " widthSpec: " + widthSpec + " heightSpec: " + heightSpec)
        console.log(tag, uuid + " childrenRect: " + uuid + " onChildrenRectChanged: " +childrenRect)
        this.childrenRectWidth = childrenRect.width
        this.childrenRectHeight = childrenRect.height

        if (this.widthSpec === 1) {
            this.width = childrenRectWidth
        }

        if (this.heightSpec === 1) {
            this.height = childrenRectHeight
        }
    }

    color: 'transparent'

    RowLayout {
        spacing: 0
    }
}
