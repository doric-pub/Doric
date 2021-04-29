import QtQuick 2.12
import QtQuick.Controls 2.5

Rectangle {
    property var backgroundColor

    onBackgroundColorChanged: {
        color = backgroundColor
    }
}
