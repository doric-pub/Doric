import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

import "util.mjs" as Util
import "gravity.mjs" as Gravity

Rectangle {
    property var wrapper

    clip: true

    property var tag: "VLayout"

    property var uuid: Util.uuidv4()

    property int widthSpec: 0
    property int heightSpec: 0
    property int childrenRectWidth: childrenRect.width
    property int childrenRectHeight: childrenRect.height

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onWidthSpecChanged: {
        console.log(tag, uuid + " onWidthSpecChanged: " + this.widthSpec)
        console.log(tag, uuid + " parent width: " + parent.width)

        if (this.widthSpec === 2) {
            this.width = parent.width
            children[1].width = parent.width
        }
    }

    onHeightSpecChanged: {
        console.log(tag, uuid + " onHeightSpecChanged: " + this.heightSpec)
        console.log(tag, uuid + " parent height: " + parent.height)

        if (this.heightSpec === 2) {
            this.height = parent.height
            children[1].height = parent.height
        }
    }

    onChildrenRectChanged: {
        console.log(tag, uuid + " widthSpec: " + widthSpec + " heightSpec: " + heightSpec)
        console.log(tag, uuid + " onChildrenRectChanged: " + childrenRect)
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

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }

    ColumnLayout {
        property int gravity: 0

        spacing: 0

        Item {
            id: head
            objectName: "head"
        }

        onChildrenChanged: {
            console.log(tag, uuid + " gravity: " + gravity)

            for (var i = 0;i !== children.length;i++) {
                if (children[i] !== head && children[i] !== tail) {
                    switch(this.gravity) {
                        case Gravity.enumerate().CENTER_X:
                            children[i].Layout.alignment = Qt.AlignHCenter
                            break
                        case Gravity.enumerate().CENTER:
                            children[i].Layout.alignment = Qt.AlignCenter
                            break
                    }
                }
            }

            if (gravity === Gravity.enumerate().CENTER || gravity === Gravity.enumerate().CENTER_Y) {
                head.Layout.fillHeight = true
            }
        }

        Item {
            id: tail
            objectName: "tail"
            Layout.fillHeight: true
        }
    }
}
