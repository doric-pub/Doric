QT += quick

CONFIG += c++14
QMAKE_CXXFLAGS += -std=c++14

TARGET = DoricCore

TEMPLATE = lib

# The following define makes your compiler emit warnings if you use
# any Qt feature that has been marked deprecated (the exact warnings
# depend on your compiler). Refer to the documentation for the
# deprecated API to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS
DEFINES += DORIC_LIBRARY

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
        engine/DoricBridgeExtension.cpp \
        engine/DoricJSEngine.cpp \
        engine/DoricNativeEmpty.cpp \
        engine/DoricNativeJSE.cpp \
        engine/DoricNativeLog.cpp \
        engine/DoricNativeRequire.cpp \
        engine/DoricTimerExtension.cpp \
        engine/native/NativeExecutor.cpp \
        engine/v8/JSValueHelper.cpp \
        engine/v8/V8Executor.cpp \
        plugin/DoricModalPlugin.cpp \
        plugin/DoricNetworkPlugin.cpp \
        plugin/DoricPopoverPlugin.cpp \
        plugin/DoricShaderPlugin.cpp \
        plugin/DoricStoragePlugin.cpp \
        shader/DoricGroupNode.cpp \
        shader/DoricHLayoutNode.cpp \
        shader/DoricImageNode.cpp \
        shader/DoricInputNode.cpp \
        shader/DoricRootNode.cpp \
        shader/DoricScrollerNode.cpp \
        shader/DoricStackNode.cpp \
        shader/DoricSuperNode.cpp \
        shader/DoricSwitchNode.cpp \
        shader/DoricTextNode.cpp \
        shader/DoricVLayoutNode.cpp \
        shader/DoricViewNode.cpp \
        shader/slider/DoricSlideItemNode.cpp \
        shader/slider/DoricSliderNode.cpp \
        utils/DoricConstant.cpp \
        utils/DoricContextHolder.cpp \
        utils/DoricDialogBridge.cpp \
        utils/DoricImageBridge.cpp \
        utils/DoricInputBridge.cpp \
        utils/DoricLayouts.cpp \
        utils/DoricMouseAreaBridge.cpp \
        utils/DoricSwitchBridge.cpp \
        widget/flex/FlexLayout.cpp \
        widget/flex/FlexLayoutConfig.cpp \
        widget/flex/FlexLayoutService.cpp \
        yoga/Utils.cpp \
        yoga/YGConfig.cpp \
        yoga/YGEnums.cpp \
        yoga/YGLayout.cpp \
        yoga/YGNode.cpp \
        yoga/YGNodePrint.cpp \
        yoga/YGStyle.cpp \
        yoga/YGValue.cpp \
        yoga/Yoga.cpp \
        yoga/event/event.cpp \
        yoga/internal/experiments.cpp \
        yoga/log.cpp

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
    Doric.h \
    DoricContext.h \
    DoricContextManager.h \
    DoricExport.h \
    DoricInterfaceDriver.h \
    DoricLibrary.h \
    DoricNativeDriver.h \
    DoricPanel.h \
    DoricRegistry.h \
    async/DoricAsyncCall.h \
    async/DoricAsyncResult.h \
    engine/DoricBridgeExtension.h \
    engine/DoricInterfaceJSE.h \
    engine/DoricJSEngine.h \
    engine/DoricNativeEmpty.h \
    engine/DoricNativeJSE.h \
    engine/DoricNativeLog.h \
    engine/DoricNativeRequire.h \
    engine/DoricPromise.h \
    engine/DoricTimerExtension.h \
    engine/native/NativeExecutor.h \
    engine/v8/JSValueHelper.h \
    engine/v8/V8Executor.h \
    plugin/DoricModalPlugin.h \
    plugin/DoricNativePlugin.h \
    plugin/DoricNetworkPlugin.h \
    plugin/DoricPopoverPlugin.h \
    plugin/DoricShaderPlugin.h \
    plugin/DoricStoragePlugin.h \
    shader/DoricGroupNode.h \
    shader/DoricHLayoutNode.h \
    shader/DoricImageNode.h \
    shader/DoricInputNode.h \
    shader/DoricRootNode.h \
    shader/DoricScrollerNode.h \
    shader/DoricStackNode.h \
    shader/DoricSuperNode.h \
    shader/DoricSwitchNode.h \
    shader/DoricTextNode.h \
    shader/DoricVLayoutNode.h \
    shader/DoricViewNode.h \
    shader/slider/DoricSlideItemNode.h \
    shader/slider/DoricSliderNode.h \
    template/DoricSingleton.h \
    utils/DoricConstant.h \
    utils/DoricContextHolder.h \
    utils/DoricCountDownLatch.h \
    utils/DoricDialogBridge.h \
    utils/DoricImageBridge.h \
    utils/DoricInputBridge.h \
    utils/DoricLayouts.h \
    utils/DoricMouseAreaBridge.h \
    utils/DoricNetworkService.h \
    utils/DoricObjectFactory.h \
    utils/DoricSwitchBridge.h \
    utils/DoricThreadMode.h \
    utils/DoricUtils.h \
    widget/flex/FlexLayout.h \
    widget/flex/FlexLayoutConfig.h \
    widget/flex/FlexLayoutService.h \
    yoga/BitUtils.h \
    yoga/CompactValue.h \
    yoga/Utils.h \
    yoga/YGConfig.h \
    yoga/YGEnums.h \
    yoga/YGFloatOptional.h \
    yoga/YGLayout.h \
    yoga/YGMacros.h \
    yoga/YGNode.h \
    yoga/YGNodePrint.h \
    yoga/YGStyle.h \
    yoga/YGValue.h \
    yoga/Yoga-internal.h \
    yoga/Yoga.h \
    yoga/event/event.h \
    yoga/internal/experiments-inl.h \
    yoga/internal/experiments.h \
    yoga/log.h

win32:CONFIG(debug, debug|release): {
    QMAKE_CFLAGS_DEBUG += -MTd
    QMAKE_CXXFLAGS_DEBUG += -MTd

    LIBS += -lwinmm
    LIBS += -lAdvapi32
    LIBS += -lDbghelp

    INCLUDEPATH += $$PWD/../../v8/v8/win32/include

    LIBS += -L$$PWD/../../v8/v8/win32/debug/ia32/
    LIBS += -lv8_monolith
}
else:win32:CONFIG(release, debug|release): {
    QMAKE_CFLAGS_RELEASE += -MT
    QMAKE_CXXFLAGS_RELEASE += -MT

    LIBS += -lwinmm
    LIBS += -lAdvapi32
    LIBS += -lDbghelp

    INCLUDEPATH += $$PWD/../../v8/v8/win32/include

    LIBS += -L$$PWD/../../v8/v8/win32/release/ia32/
    LIBS += -lv8_monolith
}
else:unix: {
    QMAKE_CFLAGS_RELEASE += -MT
    QMAKE_CXXFLAGS_RELEASE += -MT

    INCLUDEPATH += $$PWD/../../v8/v8/darwin/include

    LIBS += -L$$PWD/../../v8/v8/darwin/release/
    LIBS += -lv8_monolith

    DEFINES += V8_COMPRESS_POINTERS
}
