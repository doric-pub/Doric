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
 <a href="README.md">
     中文
 </a>
</div>

# Doric
Doric is a high-performance framework for cross-platform development. With TSX or TypeScript, a set of code can perform consistently across different platforms.

## Feature
### Cross-platform consistency
Doric supports Android, iOS, Qt & Web, implements 'write once, run anywhere, perform consistently' across different platforms.
### High-performance rendering
Doric adopts native components or widgets on rendering views, provides a set of APIs under native standard. Doric architecture has multiple inner mechanism for efficient communication between 'Native' & 'JS', such as dirty-value detection、local-update on views, thus Doric pages will rival native pages on performance when rendering.
### Light-weight & Easy-extensible
Doric SDK follows fundamental principles, its core provides universal views, components and native modules, which can properly satisfy most scenarios.
Moreover, Doric provides an integral mechanism for plugin development, you can register your libraries or plugins with Doric API to provide view components or other native abilities.
### Easy to get started with sufficient toolchains
Doric includes a scaffolding tool `doric-cli` and a debug tool `Devkit`, offering multiple tools, such as hot-reload、breakpoint debugging、waterfall-like performance profile、tree nodes viewer and so on, aiming at assisting developers building user interfaces, analyzing and debugging efficiently.

## Get started
> Documentation: [https://doric.pub](https://doric.pub)
* Open the web page directly: [Doric Playgroud](https://p.doric.pub/play/?e=167#example/HelloDoric.ts) and experience coding style rapidly
* With `doric-cli` command line interfaces, you can create Doric applications, reference here by [Installation & Usage](https://doric.pub/docs/index.html#%E5%AE%89%E8%A3%85Doric)
* Use Doric in your existing Android project, reference here by [Use Doric in Android](https://doric.pub/docs/android.html)
* Use Doric in your existing iOS project, reference here by [Use Doric in iOS](https://doric.pub/docs/ios.html)

## Example code
With the following different ways to experience code style in Doric
### Declarative UI
Use TypeScript or TSX to write layout ui according to your preferences.
| TypeScript | TSX |
| ---- | ---- |
| <img src="https://user-images.githubusercontent.com/9526211/132191388-6e3740ce-2ad6-4847-86f4-a1f94a5a3a77.png" height="300px" /> | <img src="https://user-images.githubusercontent.com/9526211/132192041-bb547cb8-574b-44bb-9d8f-071f4e235f3a.png" height="300px"/>|

### Cross-platform consistency
Snapshots on Android & iOS applications written in Doric
| Android | iOS |
| ---- | ---- |
| !<img src="https://user-images.githubusercontent.com/9526211/132187361-dcafe2d1-120a-4145-ab98-3836b378576e.png" height="500px"/> | <img src="https://user-images.githubusercontent.com/9526211/132191681-0512abd2-0692-4e4f-9605-bf24d9b898c2.png" height="500px"/>|

## Plugin library in common use
### [DoricFs](https://github.com/doric-pub/DoricFs)
Ability provided with file system read-write on different platforms. (Android+iOS)
### [DoricWebSocket](https://github.com/doric-pub/DoricWebSocket)
Ability provided with web socket support. (Android+iOS)
### [DoricImagePicker](https://github.com/doric-pub/DoricImagePicker)
Ability provided with image picker and photograph. (Android+iOS)
### [DoricBarcodeScanner](https://github.com/doric-pub/DoricBarcodeScanner)
Support for scanning bar code. (Android+iOS)
### [DoricSQLite](https://github.com/doric-pub/DoricSQLite)
Provided with SQLite database manipulation. (Android+iOS)

## License
[Apache License 2.0](LICENSE)

## Welcome to join the Doric community 
| DingTalk | WeChat |
| ---- | ---- |
| <img src="https://user-images.githubusercontent.com/9526211/141051788-c9df135b-bc88-4850-a2c8-b0a65f78fd57.png" height="500px"/> | <img src="https://user-images.githubusercontent.com/9526211/142347218-b55e3755-8c29-49c6-89bc-75f2ede834ed.png" height="500px"/>|



