import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 600
    height: 844
    title: qsTr("Doric Demo")

    ColumnLayout{
        spacing: 0
        anchors.fill: parent

        Rectangle {
            id: navbar
            visible: false
            Layout.fillWidth: true
            Layout.preferredHeight: 44

            Text {
                text: "Title"
                font.pixelSize: 16
                anchors.centerIn: parent
            }

            RowLayout {
                anchors.verticalCenter: parent.verticalCenter
                Rectangle {
                    Layout.preferredWidth: 10
                }

                Image {
                    Layout.preferredWidth: 24
                    Layout.preferredHeight: 24
                    id: name
                    source: "qrc:/doric/qml/doric_icon_back.png"
                }

                Text {
                    text: "Left"
                    font.pixelSize: 16
                }

                MouseArea {
                    anchors.fill: parent
                    onClicked: {
                        navigatorPop()
                    }
                }
            }

            RowLayout {
                anchors.right: parent.right
                anchors.verticalCenter: parent.verticalCenter

                Text {
                    text: "Right"
                    font.pixelSize: 16
                }

                Rectangle {
                    Layout.preferredWidth: 10
                }
            }
        }

        Rectangle {
            Layout.fillWidth: true
            Layout.fillHeight: true

            StackView {
                id: stack
                objectName: "stackView"
                anchors.fill: parent

                initialItem: ScrollView {
                    id: entry

                    anchors.fill: parent

                    ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
                    ScrollBar.vertical.policy: ScrollBar.AlwaysOff

                    ListView {
                        width: parent.width
                        model: 23
                        boundsBehavior: Flickable.StopAtBounds

                        delegate: Rectangle {
                            Column {
                                anchors.centerIn: parent
                                Text {
                                    text: {
                                        switch (index) {
                                            case 0:
                                                return "ComponetDemo.js"
                                            case 1:
                                                return "Counter.js"
                                            case 2:
                                                return "DraggableDemo.js"
                                            case 3:
                                                return "EffectsDemo.js"
                                            case 4:
                                                return "FlexDemo.js"
                                            case 5:
                                                return "Gobang.js"
                                            case 6:
                                                return "ImageDemo.js"
                                            case 7:
                                                return "InputDemo.js"
                                            case 8:
                                                return "LayoutDemo.js"
                                            case 9:
                                                return "LayoutTestDemo.js"
                                            case 10:
                                                return "ModalDemo.js"
                                            case 11:
                                                return "ModularDemo.js"
                                            case 12:
                                                return "NavigatorDemo.js"
                                            case 13:
                                                return "NetworkDemo.js"
                                            case 14:
                                                return "NotificationDemo.js"
                                            case 15:
                                                return "PopoverDemo.js"
                                            case 16:
                                                return "ScrollerDemo.js"
                                            case 17:
                                                return "SimpleDemo.js"
                                            case 18:
                                                return "SliderDemo.js"
                                            case 19:
                                                return "Snake.js"
                                            case 20:
                                                return "StorageDemo.js"
                                            case 21:
                                                return "SwitchDemo.js"
                                            case 22:
                                                return "TextDemo.js"
                                        }
                                    }
                                }
                            }
                            width: parent.width
                            height: 60
                            MouseArea {
                                anchors.fill: parent
                                onClicked: {
                                    demoBridge.navigate(index)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function navigatorPush(page) {
        stack.push(page)
        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }

    function navigatorPop() {
        stack.pop()
        console.log("stack.depth", stack.depth)
        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }
}
