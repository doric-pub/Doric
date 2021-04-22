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
    property var cancelLabel

    onTitleChanged: {
        dialog.title = title
    }

    onOkLabelChanged: {
        dialog.standardButton(Dialog.Ok).text = qsTrId(okLabel)
    }

    onCancelLabelChanged: {
        dialog.standardButton(Dialog.Cancel).text = qsTrId(cancelLabel)
    }

    Dialog {
        id: dialog
        standardButtons: Dialog.Ok | Dialog.Cancel
        modal: true

        onAccepted: {
            dialogBridge.onAccepted(pointer, plugin, callbackId)
        }

        onRejected: {
            dialogBridge.onRejected(pointer, plugin, callbackId)
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
