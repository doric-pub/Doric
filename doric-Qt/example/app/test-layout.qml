import QtQuick 2.0
import QtQuick.Controls 2.5
import QtQuick.Layouts 1.15

ApplicationWindow {
    visible: true
    width: 600
    height: 800
    title: qsTr("Scroll")

    SwipeView {
        id: view

        currentIndex: 0
        anchors.fill: parent

        Rectangle {
            id: firstPage
            color: 'red'
        }
        Rectangle {
            id: secondPage
            color: 'green'
        }
        Rectangle {
            id: thirdPage
            color: 'blue'
        }
    }

    PageIndicator {
        id: indicator

        count: view.count
        currentIndex: view.currentIndex

        anchors.bottom: view.bottom
        anchors.horizontalCenter: parent.horizontalCenter
    }
}
