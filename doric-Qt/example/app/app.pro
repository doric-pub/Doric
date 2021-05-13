QT += quick

CONFIG += c++14

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        demo/DoricDemoBridge.cpp \
        main.cpp

HEADERS += \
    demo/DoricDemoBridge.h

RESOURCES += qml.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Additional import path used to resolve QML modules just for Qt Quick Designer
QML_DESIGNER_IMPORT_PATH =

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

win32:CONFIG(debug, debug|release): {
    QMAKE_CFLAGS_DEBUG += -MT
    QMAKE_CXXFLAGS_DEBUG += -MT

    LIBS += -lwinmm
    LIBS += -lAdvapi32
    LIBS += -lDbghelp

    LIBS += -L$$PWD/../../v8/v8/win32/release/
    LIBS += -lv8_monolith
}
else:win32:CONFIG(release, debug|release): {
    QMAKE_CFLAGS_RELEASE += -MT
    QMAKE_CXXFLAGS_RELEASE += -MT

    LIBS += -lwinmm
    LIBS += -lAdvapi32
    LIBS += -lDbghelp

    LIBS += -L$$PWD/../../v8/v8/win32/release/
    LIBS += -lv8_monolith
}
else:unix: {
    LIBS += -L$$PWD/../../v8/v8/darwin/release/
    LIBS += -lv8_monolith
}

INCLUDEPATH += $$PWD/../doric

LIBS += -L$$OUT_PWD/../../binary/doric -lDoricCore
