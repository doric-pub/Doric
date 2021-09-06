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

# Doric
Doric是一套高性能的跨平台开发框架,使用TSX/TypeScript开发,一套代码可在不同平台展示出同样的页面.当前已支持Android、iOS、Qt等平台及WebComponent引入.

## 项目特色
### 跨平台
Doric目前已支持Android、iOS、Qt、Web,可通过一套代码在各平台展示一致的前端页面.
### 高性能
### 易扩展
### 高可用
### 灵活

## 快速使用
### 项目地址: [https://doric.pub](https://doric.pub)
* 您可以直接打开网页[Doric Playgroud](https://p.doric.pub/play/?e=167#example/HelloDoric.ts)快速体验Doric中的风格
* 您可以通过`doric-cli`命令行工具直接创建Doric工程,可参考[安装使用](https://doric.pub/docs/index.html#%E5%AE%89%E8%A3%85Doric)
* 如果您需要在现有Android项目中接入使用Doric,可参考[在Android中使用Doric](https://doric.pub/api/android.html)
* 如果您需要在现有iOS项目中接入使用Doric,可参考[在iOS中使用Doric](https://doric.pub/api/ios.html)

## 示例代码
### 声明式UI    
```typescript
   vlayout(
       [
           image({
               imageUrl: 'https://doric.pub/logo.png'
           }),
           text({
               text: "Hello,Doric",
               textSize: 16,
           }),
       ],
       {
           layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
           space: 20,
           gravity: Gravity.Center
       }
   ).in(root)
```
### TSX写法 (v0.9.0以上支持)
```tsx
<VLayout
      parent={root}
      layoutConfig={layoutConfig().fit().configAlignment(Gravity.Center)}
      space={20}
      gravity={Gravity.Center}
    >
      <Image imageUrl="https://doric.pub/logo.png" />
      <Text textSize={16}>Hello,Doric</Text>
</VLayout>
```

## License

[Apache License 2.0](LICENSE)
