#pragma once

#include "ark_runtime/jsvm.h"
#include <rawfile/raw_dir.h>
#include <rawfile/raw_file_manager.h>
#include <string>

class DoricUtils {
public:
    static NativeResourceManager *GlobalNativeResourceManager;

    static std::string GetValueString(JSVM_Env env, JSVM_Value value) {
        constexpr size_t PREALLOC_SIZE = 256;
        char preallocMemory[PREALLOC_SIZE];

        char *buff = preallocMemory;

        size_t totalLen = 0;
        OH_JSVM_GetValueStringUtf8(env, value, nullptr, 0, &totalLen);
        size_t needed = totalLen + 1;

        if (needed > PREALLOC_SIZE) {
            // 分配空间，大小需包含终止字符
            buff = new char[needed];
        }
        OH_JSVM_GetValueStringUtf8(env, value, buff, needed, nullptr);

        std::string ret(buff, totalLen);

        if (needed > PREALLOC_SIZE) {
            delete[] buff;
        }
        return ret;
    }

    static std::string ReadRawFile(std::string rawFileName) {
        RawFile *rawFile = OH_ResourceManager_OpenRawFile(DoricUtils::GlobalNativeResourceManager, rawFileName.c_str());
        long rawFileSize = OH_ResourceManager_GetRawFileSize(rawFile);
        std::unique_ptr<uint8_t[]> data = std::make_unique<uint8_t[]>(rawFileSize);
        int result = OH_ResourceManager_ReadRawFile(rawFile, data.get(), rawFileSize);
        OH_ResourceManager_CloseRawFile(rawFile);

        std::string fileContent(reinterpret_cast<char *>(data.get()));
        return fileContent;
    }
};

// 静态成员变量需要在类外定义和初始化
NativeResourceManager *DoricUtils::GlobalNativeResourceManager = nullptr;