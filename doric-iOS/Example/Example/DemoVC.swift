//
//  DemoVC.swift
//  Example
//
//  Created by pengfei.zhou on 2023/7/7.
//  Copyright © 2023 pengfei.zhou. All rights reserved.
//

import UIKit

class DemoVC: UIViewController {
    let filePath: String

    @objc init(path: String) {
        filePath = path;
        super.init(nibName: nil, bundle: nil)

    }

    required init?(coder: NSCoder) {
        filePath = "";
        super.init(coder: coder)
    }

    override func viewDidLoad() {
        super.viewDidLoad();
        title = filePath;
        view.backgroundColor = UIColor.white;
        let jsContent = try? String(contentsOfFile: Bundle.main.bundlePath + "/src/" + filePath,
                encoding: String.Encoding.utf8)
        let doricPanel = DoricPanel()
        doricPanel.view.width = view.width
        doricPanel.view.height = view.height
        view.addSubview(doricPanel.view)
        addChild(doricPanel)
        doricPanel.config(jsContent, alias: filePath, extra: nil)
    }
}
