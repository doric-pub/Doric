QT += quick

CONFIG += c++11

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Refer to the documentation for the
# deprecated API to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
        async/async_result.cpp \
        async/settable_future.cpp \
        context.cpp \
        engine/bridge_extension.cpp \
        engine/js_engine.cpp \
        engine/native_empty.cpp \
        engine/native_jse.cpp \
        engine/native_log.cpp \
        engine/timer_extension.cpp \
        main.cpp \
        native_driver.cpp \
        utils/constant.cpp

RESOURCES += qml.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Additional import path used to resolve QML modules just for Qt Quick Designer
QML_DESIGNER_IMPORT_PATH =

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

HEADERS += \
    async/async_call.h \
    async/async_result.h \
    async/callback.h \
    async/settable_future.h \
    context.h \
    context_manager.h \
    engine/bridge_extension.h \
    engine/interface_jse.h \
    engine/js_engine.h \
    engine/native_empty.h \
    engine/native_jse.h \
    engine/native_log.h \
    engine/timer_extension.h \
    interface_driver.h \
    native_driver.h \
    template/singleton.h \
    utils/constant.h \
    utils/count_down_latch.h \
    utils/utils.h
