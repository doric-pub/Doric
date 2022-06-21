<div align="center">
 <a href="https://doric.pub">
    <img alt="Doric" src="https://doric.pub/logo.png" width="200" />
 </a>
</div>

<div align="center">
<a href="https://github.com/doric-pub/Doric/blob/master/LICENSE">
    <img alt="license" src="https://img.shields.io/npm/l/doric" />
</a>
<a href="https://github.com/doric-pub/Doric/actions">
    <img alt="Actions" src="https://github.com/doric-pub/Doric/workflows/Release/badge.svg" />
</a>
</div>
<div align="center">
  <a href= "https://www.npmjs.com/package/doric">
     <img src="https://img.shields.io/npm/v/doric"/>
  </a>
  <a href="https://mvnrepository.com/artifact/pub.doric/core">
    <img src="https://img.shields.io/maven-central/v/pub.doric/core"/>
  </a>
  <a href="https://cocoapods.org/pods/DoricCore">
    <img src="https://img.shields.io/cocoapods/v/DoricCore"/>
  </a>
</div>

<div align="center">
 <a href="https://www.oscs1024.com/project/oscs/doric-pub/Doric?ref=badge_small" alt="OSCS Status"><img src="https://www.oscs1024.com/platform/badge/doric-pub/Doric.svg?size=small"/></a>
</div>
<div align="center">
 <a href="README-en.md">
     English
 </a>
</div>

# Doric
Doric是一套高性能的跨平台开发框架,使用TSX/TypeScript开发,一套代码可在不同平台展示出同样的页面.

## OSCS
[![OSCS Status](https://www.oscs1024.com/platform/badge/doric-pub/Doric.svg?size=large)](https://www.oscs1024.com/project/doric-pub/Doric?ref=badge_large)

## 特色
### 跨平台统一
Doric目前已支持Android、iOS、Qt、Web,可通过一套代码在各平台展示一致的前端页面.
### 高性能渲染
Doric渲染视图时使用原生组件,在API上遵循原生接口,在架构上采用脏值检测、局部更新等多种机制实现JS与原生间的高效通信,Doric页面的渲染及运行性能可真正达到与原生媲美.
### 轻量化,易扩展
Doric中遵循轻量化的原则,SDK提供核心能力及通用的视图组件和平台的原生能力模块,可以满足常用的需求.
同时,Doric中也提供了完备的插件机制,您可以通过注册插件来向Doric中提供视图组件或原生能力.
### 易上手,丰富的工具链
Doric提供脚手架工具`doric-cli`及开发调试工具`Devkit`,提供热重载、断点调试、性能瀑布图、节点查看器等多种工具,帮助开发者更方便快捷地开发页面,并进行分析调试.

## 快速使用
> 项目文档: [https://doric.pub](https://doric.pub)
* 您可以直接打开网页[Doric Playgroud](https://p.doric.pub/play/?e=167#example/HelloDoric.ts)快速体验Doric中的风格
* 您可以通过`doric-cli`命令行工具直接创建Doric应用,可参考[安装使用](https://doric.pub/docs/index.html#%E5%AE%89%E8%A3%85Doric)
* 如果您需要在现有Android项目中接入使用Doric,可参考[在Android中使用Doric](https://doric.pub/docs/android.html)
* 如果您需要在现有iOS项目中接入使用Doric,可参考[在iOS中使用Doric](https://doric.pub/docs/ios.html)

## 示例代码
您可以通过下方代码体验Doric中的编写风格
### 声明式UI
您可以根据喜好,使用TypeScript或TSX语法书写布局.
| TypeScript | TSX |
| ---- | ---- |
| <img src="https://user-images.githubusercontent.com/9526211/132191388-6e3740ce-2ad6-4847-86f4-a1f94a5a3a77.png" height="300px" /> | <img src="https://user-images.githubusercontent.com/9526211/132192041-bb547cb8-574b-44bb-9d8f-071f4e235f3a.png" height="300px"/>|

### 跨平台统一
下图为代码在Android及iOS应用上的运行截图
| Android | iOS |
| ---- | ---- |
| !<img src="https://user-images.githubusercontent.com/9526211/132187361-dcafe2d1-120a-4145-ab98-3836b378576e.png" height="500px"/> | <img src="https://user-images.githubusercontent.com/9526211/132191681-0512abd2-0692-4e4f-9605-bf24d9b898c2.png" height="500px"/>|

## 常用插件库
### [DoricFs](https://github.com/doric-pub/DoricFs)
提供平台中读写文件系统的能力(Android+iOS)
### [DoricWebSocket](https://github.com/doric-pub/DoricWebSocket)
提供WebSocket能力支持(Android+iOS)
### [DoricImagePicker](https://github.com/doric-pub/DoricImagePicker)
提供图片选择及拍照功能(Android+iOS)
### [DoricBarcodeScanner](https://github.com/doric-pub/DoricBarcodeScanner)
提供扫码支持(Android+iOS)
### [DoricSQLite](https://github.com/doric-pub/DoricSQLite)
提供SQLite数据库支持(Android+iOS)

## License

[Apache License 2.0](LICENSE)


## 欢迎扫码加入Doric社区讨论交流
| 钉钉 | 微信 |
| ---- | ---- |
| <img src="https://user-images.githubusercontent.com/9526211/141051788-c9df135b-bc88-4850-a2c8-b0a65f78fd57.png" height="500px"/> | <img src="https://user-images.githubusercontent.com/9526211/154933741-b5df7ebd-6866-4835-9ece-bc35b3ecdaed.png" height="500px"/>|


