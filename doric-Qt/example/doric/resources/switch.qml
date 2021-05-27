import QtQuick 2.12
import QtQuick.Controls 2.5

import "util.mjs" as Util

Switch {
    property var wrapper

    property var uuid: Util.uuidv4()

    property var tag: "Switch"

    property var offTintColor: "#42000000"
    property var onTintColor: "#00ff00"
    property var thumbTintColor: "white"

    Component.onCompleted: {
        this.indicator.children[1].color = thumbTintColor
    }

    onThumbTintColorChanged: {
        this.indicator.children[1].color = thumbTintColor
    }

    onCheckedChanged: {
        console.log(onTintColor)
        console.log(offTintColor)
        console.log(thumbTintColor)
        if (checked) {
            this.indicator.children[0].color = onTintColor
        } else {
            this.indicator.children[0].color = offTintColor
        }
    }
}
