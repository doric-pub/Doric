import QtQuick 2.6
import QtQuick.Controls 2.13
import QtQuick.Window 2.2

Window {
    visible: true
    width: 360;
    height: 640;
    title: qsTr("Hello Doric");

    StackView {
        id: stack;
        anchors.centerIn: parent;
        initialItem: mainView;
        width: 360;
        height: 640;
    }

    Rectangle {
        id: mainView;
        color: "lightgreen";
    }
}
