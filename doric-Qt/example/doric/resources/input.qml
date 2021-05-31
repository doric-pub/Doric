import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util
import "gravity.mjs" as Gravity

TextField {
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
    }

    onHeightChanged: {
        bg.implicitHeight = height
        console.log(tag, uuid + " onHeightChanged: " + this.height)
    }

    onTextChanged: {
        console.log(tag, uuid + " onTextChanged: " + this.text)
        inputBridge.onTextChange(wrapper, this.text)
    }

    onFocusChanged: {
        console.log(tag, uuid + " onFocusChanged: " + this.focus)
        inputBridge.onFocusChange(wrapper, this.focus)
    }

    onMaximumLengthChanged: {
        console.log(tag, uuid + " onMaximumLengthChanged: " + this.maximumLength)
    }

    property var inputType: 0

    property var numberValidator: IntValidator {}
    property var decimalValidator: DoubleValidator {}
    property var alphabetValidator: RegExpValidator { regExp: /^[A-Z]+$/i}

    onInputTypeChanged: {
        console.log(tag, uuid + " onInputTypeChanged: " + this.inputType)
        switch (inputType) {
        case 1:
            this.validator = numberValidator
            break
        case 2:
            this.validator = decimalValidator
            break
        case 3:
            this.validator = alphabetValidator
            break
        }
    }

    property var password: false
    onPasswordChanged: {
        if (password) {
            this.echoMode = TextInput.Password
        } else {
            this.echoMode = TextInput.Normal
        }
    }

    passwordCharacter: "•"

    property var borderWidth: 0
    onBorderWidthChanged: {
        bg.border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        bg.border.color = borderColor
    }
}
