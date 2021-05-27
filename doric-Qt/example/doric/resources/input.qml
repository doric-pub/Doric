import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util
import "gravity.mjs" as Gravity

TextArea {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Input"

    leftPadding: 0
    topPadding: 0
    rightPadding: 0
    bottomPadding: 0

    property int textAlignment: 0

    background: Rectangle {
        id: bg
        color: 'transparent'
    }

    property var backgroundColor

    onBackgroundColorChanged: {
        bg.color = backgroundColor
    }

    horizontalAlignment: TextInput.AlignLeft
    verticalAlignment: TextInput.AlignTop

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
        console.log(tag, uuid + " onWidthChanged: " + this.width)

        let tempText = this.text
        this.text = ""
        this.text = tempText
    }

    onHeightChanged: {
        bg.implicitHeight = height
        console.log(tag, uuid + " onHeightChanged: " + this.height)

        let tempText = this.text
        this.text = ""
        this.text = tempText
    }

    onTextChanged: {
        console.log(tag, uuid + " onTextChanged: " + this.text)
        inputBridge.onTextChange(wrapper, this.text)
    }

    property var borderWidth: 0
    onBorderWidthChanged: {
        bg.border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        bg.border.color = borderColor
    }
}
