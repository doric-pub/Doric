import QtQuick 2.12
import QtQuick.Controls 2.12
import QtQuick.Layouts 1.15

Window {
    id: window

    flags: flags | Qt.WindowStaysOnTopHint | Qt.Tool | Qt.FramelessWindowHint
    visible: true
    modality: Qt.ApplicationModal

    property var pointer
    property var plugin
    property var callbackId

    property var title
    property var msg
    property var okLabel
    property var cancelLabel

    onTitleChanged: {
        dialog.title = title
    }

    onMsgChanged: {
        content.text = msg
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
        contentItem: ColumnLayout {
            Text {
                id: content
            }

            TextArea {
                id: input
                Layout.fillWidth: true
            }
        }

        onAccepted: {
            dialogBridge.onAcceptedWithInput(pointer, plugin, callbackId, input.text)
        }

        onRejected: {
            dialogBridge.onRejectedWithInput(pointer, plugin, callbackId, input.text)
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
