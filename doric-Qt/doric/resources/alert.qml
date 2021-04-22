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

    property var title
    property var okLabel

    onTitleChanged: {
        dialog.title = title
    }

    onOkLabelChanged: {
        dialog.standardButton(Dialog.Ok).text = qsTrId(okLabel)
    }

    Dialog {
        id: dialog
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
    }
}
