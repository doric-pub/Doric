import QtQuick 2.12
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.14

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
            objectName: "navbar"
            visible: false
            Layout.fillWidth: true
            Layout.preferredHeight: 44

            Rectangle {
                anchors.fill: parent
                color: "transparent"

                Text {
                    anchors.centerIn: parent
                    objectName: "title"
                    font.pixelSize: 16
                }

                Rectangle {
                    anchors.centerIn: parent
                    objectName: "center"
                    width: childrenRect.width
                    height: childrenRect.height
                }
            }

            RowLayout {
                anchors.verticalCenter: parent.verticalCenter
                Rectangle {
                    Layout.preferredWidth: 10
                }

                RowLayout {
                    objectName: "left"

                    Image {
                        Layout.preferredWidth: 24
                        Layout.preferredHeight: 24
                        id: name
                        source: "qrc:/doric/qml/doric_icon_back.png"
                    }
                }

                MouseArea {
                    width: parent.width
                    height: parent.height
                    onClicked: {
                        navigatorPop()
                    }
                }
            }

            RowLayout {
                id: rightSection
                height: navbar.height
                anchors.verticalCenter: parent.verticalCenter

                RowLayout {
                    objectName: "right"
                    width: childrenRect.width

                    onChildrenRectChanged: {
                        rightSection.x = navbar.width - this.childrenRect.width - 10
                    }
                }
            }
        }

        Rectangle {
            id: content
            Layout.fillWidth: true
            Layout.fillHeight: true

            StackView {
                id: stack
                objectName: "stackView"
                anchors.fill: content

                initialItem: ScrollView {
                    id: entry

                    width: content.width
                    height: content.height

                    ScrollBar.horizontal.policy: ScrollBar.AlwaysOff
                    ScrollBar.vertical.policy: ScrollBar.AlwaysOff

                    ListView {
                        id: list
                        width: content.width
                        model: 25
                        boundsBehavior: Flickable.StopAtBounds

                        function getSource(index) : string {
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
                                    return "ListDemo.js"
                                case 11:
                                    return "ModalDemo.js"
                                case 12:
                                    return "ModularDemo.js"
                                case 13:
                                    return "NavBarDemo.js"
                                case 14:
                                    return "NavigatorDemo.js"
                                case 15:
                                    return "NetworkDemo.js"
                                case 16:
                                    return "NotificationDemo.js"
                                case 17:
                                    return "PopoverDemo.js"
                                case 18:
                                    return "ScrollerDemo.js"
                                case 19:
                                    return "SimpleDemo.js"
                                case 20:
                                    return "SliderDemo.js"
                                case 21:
                                    return "Snake.js"
                                case 22:
                                    return "StorageDemo.js"
                                case 23:
                                    return "SwitchDemo.js"
                                case 24:
                                    return "TextDemo.js"
                            }
                        }

                        delegate: Rectangle {
                            Column {
                                anchors.centerIn: parent
                                Text {
                                    text: {
                                        return list.getSource(index)
                                    }
                                }
                            }
                            width: content.width
                            height: 60
                            MouseArea {
                                anchors.fill: parent
                                onClicked: {
                                    let source = list.getSource(index)
                                    demoBridge.navigate("assets://src/" + source, source)
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
        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }

    function navigatorPopToRoot() {
        while (stack.depth > 1) {
            stack.pop()
        }

        if (stack.depth > 1) {
            navbar.visible = true
        } else {
            navbar.visible = false
        }
    }
}
