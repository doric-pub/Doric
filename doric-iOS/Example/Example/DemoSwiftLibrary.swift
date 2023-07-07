//
// Created by pengfei.zhou on 2023/7/7.
// Copyright (c) 2023 pengfei.zhou. All rights reserved.
//

import Foundation

class DemoSwiftPlugin: DoricNativePlugin {
    @objc func test() {
        print("Here at test")
    }

    @objc func testData(data: String) {
        print("Here at test, data is " + data)
    }
    
    @objc func testReturn(data: String,promise: DoricPromise) {
        print("Here at test, promise ")
        promise.resolve("This is from native")
    }
}


class DemoSwiftLibrary: DoricLibrary {
    override func load(_ registry: DoricRegistry!) {
        registry.registerNativePlugin(DemoSwiftPlugin.self, withName: "demoSwift");
    }
}
