import QtQuick 2.12
import QtQuick.Controls 2.12

Window {
    id: window

    flags: flags | Qt.WindowStaysOnTopHint | Qt.Tool | Qt.FramelessWindowHint
    visible: true
    modality: Qt.ApplicationModal

    property var pointer
    property var plugin
    property var callbackId

    Dialog {
        id: dialog
        title: "Title"
        standardButtons: Dialog.Ok
        modal: true

        onAccepted: {
            dialogOnAcceptedBridge.onClick(pointer, plugin, callbackId)
        }

        onWidthChanged: {
            window.width = implicitWidth
        }

        onHeightChanged: {
            window.height = implicitHeight
        }
    }

    Component.onCompleted: {
        dialog.open()
        dialog.standardButton(Dialog.Ok).text = qsTrId("OkLabel")
    }
}
