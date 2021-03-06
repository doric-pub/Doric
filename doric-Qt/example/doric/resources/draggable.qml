import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.14
import QtGraphicalEffects 1.12

import "util.mjs" as Util

Rectangle {
    id: root
    property var wrapper

    clip: true

    property var uuid: Util.uuidv4()

    property var tag: "Draggable"

    onWidthChanged: {
        console.log(tag, uuid + " onWidthChanged: " + this.width)

        updateGradient()
    }

    onHeightChanged: {
        console.log(tag, uuid + " onHeightChanged: " + this.height)

        updateGradient()
    }

    color: 'transparent'

    property var backgroundColor

    onBackgroundColorChanged: {
        color = backgroundColor
    }

    property var borderWidth: 0
    onBorderWidthChanged: {
        border.width = borderWidth
    }

    property var borderColor: ""
    onBorderColorChanged: {
        border.color = borderColor
    }

    Drag.active: dragArea.drag.active

    MouseArea {
        id: dragArea
        anchors.fill: parent

        drag.target: parent

        onPositionChanged: {
            let positionToRootParent = mapToItem(root.parent, mouse.x, mouse.y)
            let positionToRoot = mapToItem(root, mouse.x, mouse.y)
            let xDiff = positionToRootParent.x - positionToRoot.x
            let yDiff = positionToRootParent.y - positionToRoot.y

            console.log(tag, uuid + " onPositionChanged: " + xDiff + ", " + yDiff)

            draggableBridge.onDrag(wrapper, xDiff, yDiff)
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


    property var backgroundColorIsObject: false
    onBackgroundColorIsObjectChanged: {
        if (backgroundColorIsObject) {
            lineGradient.anchors.fill = root
        } else {
            lineGradient.anchors.fill = null
        }
    }

    property variant gradientColors: []
    property variant gradientLocations: []

    onGradientColorsChanged: {
        console.log(tag, uuid + " onGradientColorsChanged: " + gradientColors)
        if (gradientColors.length > 0) {
            let stops = []

            if (gradientLocations.length == 0) {
                let unit = 1 / (gradientColors.length - 1)
                for (let i = 0;i !== gradientColors.length;i++) {
                    let a = ((gradientColors[i] >> 24) & 0xff) / 255;
                    let r = ((gradientColors[i] >> 16) & 0xff) / 255;
                    let g = ((gradientColors[i] >> 8) & 0xff) / 255;
                    let b = ((gradientColors[i] >> 0) & 0xff) / 255;
                    let stop = stopComponent.createObject(root, {"position": unit * i, "color": Qt.rgba(r, g, b, a)})
                    console.log(tag, uuid + " onGradientColorsChanged: " + "position: " + unit * i + " color: " + Qt.rgba(r, g, b, a))
                    stops.push(stop)
                }
            } else {
                for (let i = 0;i !== gradientColors.length;i++) {
                    let a = ((gradientColors[i] >> 24) & 0xff) / 255;
                    let r = ((gradientColors[i] >> 16) & 0xff) / 255;
                    let g = ((gradientColors[i] >> 8) & 0xff) / 255;
                    let b = ((gradientColors[i] >> 0) & 0xff) / 255;
                    let stop = stopComponent.createObject(root, {"position": gradientLocations[i], "color": Qt.rgba(r, g, b, a)})
                    console.log(tag, uuid + " onGradientColorsChanged: " + "position: " + gradientLocations[i] + " color: " + Qt.rgba(r, g, b, a))
                    stops.push(stop)
                }
            }

            innerGradient.stops = stops
        }
    }

    property var orientation: 0

    function updateGradient() {
        switch (orientation) {
        case 0:
            lineGradient.start = Qt.point(0, 0)
            lineGradient.end = Qt.point(0, root.height)
            break
        case 1:
            lineGradient.start = Qt.point(root.width, 0)
            lineGradient.end = Qt.point(0, root.height)
            break
        case 2:
            lineGradient.start = Qt.point(root.width, 0)
            lineGradient.end = Qt.point(0, 0)
            break
        case 3:
            lineGradient.start = Qt.point(root.width, root.height)
            lineGradient.end = Qt.point(0, 0)
            break
        case 4:
            lineGradient.start = Qt.point(0, root.height)
            lineGradient.end = Qt.point(0, 0)
            break
        case 5:
            lineGradient.start = Qt.point(0, root.height)
            lineGradient.end = Qt.point(root.width, 0)
            break
        case 6:
            lineGradient.start = Qt.point(0, 0)
            lineGradient.end = Qt.point(root.width, 0)
            break
        case 7:
            lineGradient.start = Qt.point(0, 0)
            lineGradient.end = Qt.point(root.width, root.height)
            break
        }
    }
    onOrientationChanged: {
        console.log(tag, uuid + " onOrientationChanged: " + orientation)

        updateGradient()
    }

    LinearGradient {
        Component {
            id:stopComponent
            GradientStop {}
        }

        id: lineGradient
        gradient: Gradient {
            id: innerGradient
        }
    }
}
