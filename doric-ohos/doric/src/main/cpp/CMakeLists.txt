# the minimum version of CMake.
cmake_minimum_required(VERSION 3.5.0)
project(doric-ohos)

set(CMAKE_CXX_STANDARD 17)
set(NATIVERENDER_ROOT_PATH ${CMAKE_CURRENT_SOURCE_DIR})

if(DEFINED PACKAGE_FIND_FILE)
    include(${PACKAGE_FIND_FILE})
endif()

include_directories(${NATIVERENDER_ROOT_PATH}
                    ${NATIVERENDER_ROOT_PATH}/include)

add_library(doric SHARED napi_init.cpp utils/doric_constant.cpp)
target_link_libraries(
    doric
    PUBLIC
    libace_napi.z.so
    libace_ndk.z.so
    libjsvm.so
    libhilog_ndk.z.so
    libdeviceinfo_ndk.z.so
    libbundle_ndk.z.so
    libnative_display_manager.so
    librawfile.z.so
)