import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util
import "gravity.mjs" as Gravity

TextArea {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Text"

    readOnly: true

    property int textAlignment: 0

    background: Rectangle {
        id: bg
        color: 'transparent'
    }

    property var backgroundColor

    onBackgroundColorChanged: {
        bg.color = backgroundColor
    }

    onTextAlignmentChanged: {
        let gravity = Gravity.enumerate()
        let result = this.textAlignment | gravity.CENTER_Y
        console.log(tag, uuid + " onTextAlignmentChanged: " + this.textAlignment)
        switch(result) {
            case gravity.CENTER:
                this.horizontalAlignment = TextInput.AlignHCenter
                this.verticalAlignment = TextInput.AlignVCenter
                break
        }
    }

    onWidthChanged: {
        bg.implicitWidth = width
    }

    onHeightChanged: {
        bg.implicitHeight = height
    }

    MouseArea {
        anchors.fill: parent
        onClicked: {
            console.log(tag, uuid + " wrapper: " + wrapper)
            mouseAreaBridge.onClick(wrapper)
        }
    }
}
