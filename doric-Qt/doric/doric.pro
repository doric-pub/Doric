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
        DoricContext.cpp \
        DoricContextManager.cpp \
        DoricNativeDriver.cpp \
        DoricPanel.cpp \
        DoricRegistry.cpp \
        async/DoricAsyncResult.cpp \
        async/DoricSettableFuture.cpp \
        demo/DoricDemoBridge.cpp \
        engine/DoricBridgeExtension.cpp \
        engine/DoricJSEngine.cpp \
        engine/DoricNativeEmpty.cpp \
        engine/DoricNativeJSE.cpp \
        engine/DoricNativeLog.cpp \
        engine/DoricNativeRequire.cpp \
        engine/DoricTimerExtension.cpp \
        main.cpp \
        plugin/DoricShaderPlugin.cpp \
        shader/DoricRootNode.cpp \
        shader/DoricViewNode.cpp \
        utils/DoricConstant.cpp \
        utils/DoricContextHolder.cpp

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
    DoricContext.h \
    DoricContextManager.h \
    DoricInterfaceDriver.h \
    DoricNativeDriver.h \
    DoricPanel.h \
    DoricRegistry.h \
    async/DoricAsyncCall.h \
    async/DoricAsyncResult.h \
    async/DoricCallback.h \
    async/DoricSettableFuture.h \
    demo/DoricDemoBridge.h \
    engine/DoricBridgeExtension.h \
    engine/DoricInterfaceJSE.h \
    engine/DoricJSEngine.h \
    engine/DoricNativeEmpty.h \
    engine/DoricNativeJSE.h \
    engine/DoricNativeLog.h \
    engine/DoricNativeRequire.h \
    engine/DoricTimerExtension.h \
    plugin/DoricNativePlugin.h \
    plugin/DoricShaderPlugin.h \
    shader/DoricRootNode.h \
    shader/DoricViewNode.h \
    template/DoricSingleton.h \
    utils/DoricConstant.h \
    utils/DoricContextHolder.h \
    utils/DoricCountDownLatch.h \
    utils/DoricObjectFactory.h \
    utils/DoricThreadMode.h \
    utils/DoricUtils.h
