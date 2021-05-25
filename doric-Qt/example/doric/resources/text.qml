import QtQuick 2.12
import QtQuick.Controls 2.5
import QtGraphicalEffects 1.12

import "util.mjs" as Util
import "gravity.mjs" as Gravity

TextArea {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Text"

    readOnly: true

    leftPadding: 0
    topPadding: 0
    rightPadding: 0
    bottomPadding: 0

    property int textAlignment: 0

    property var fontStyle: ""

    onFontStyleChanged: {
        if (fontStyle === "bold") {
            font.weight = Font.Bold
        } else if (fontStyle === "italic") {
            font.italic = true
        } else if (fontStyle === "bold_italic") {
            font.weight = Font.Bold
            font.italic = true
        }
    }

    background: Rectangle {
        id: bg
        color: 'transparent'
    }

    property var backgroundColor

    onBackgroundColorChanged: {
        bg.color = backgroundColor
    }

    horizontalAlignment: TextInput.AlignHCenter
    verticalAlignment: TextInput.AlignVCenter

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

    textFormat: TextEdit.AutoText

    property var strikethrough: false

    onStrikethroughChanged: {
        font.strikeout = strikethrough
    }

    property var underline: false

    onUnderlineChanged: {
        font.underline = underline
    }
}
