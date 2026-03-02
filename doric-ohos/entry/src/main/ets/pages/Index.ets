import router from '@ohos.router';

@Entry
@Component
struct Index {
  private demos: string[] = [
    'AnimatedImageDemo',
    'AnimationsDemo',
    'AnimatorDemo',
    'BlurEffectsDemo',
    'CellModule1Demo',
    'CellModule2Demo',
    'ColorPaletteDemo',
    'ComplicatedAnimations',
    'ComplicatedDemo',
    'ComponetDemo',
    'Counter',
    'DraggableDemo',
    'EffectsDemo',
    'FlexDemo',
    'FlowLayoutDemo',
    'FlowLayoutDragDemo',
    'FunctionalComponentDemo',
    'FunnyColorsDemo',
    'GestureDemo',
    'Gobang',
    'HelloDoric',
    'HorizontalListDemo',
    'HorizontalListInListDemo',
    'ImageDemo',
    'ImageProcessorDemo',
    'InputDemo',
    'KeyboardDemo',
    'LayoutDemo',
    'LayoutTestDemo',
    'ListDemo',
    'ListDragDemo',
    'ListInSliderDemo',
    'ModalDemo',
    'ModularDemo',
    'MultiPanelDemo',
    'NavbarDemo',
    'NavigatorDemo',
    'NetworkDemo',
    'NewGobangDemo',
    'NotchDemo',
    'NotificationDemo',
    'PathButtonDemo',
    'PopoverDemo',
    'RefreshableDemo',
    'RefreshDemo',
    'ResourceDemo',
    'ScrolledSliderDemo',
    'ScrollerDemo',
    'ScrollerInListDemo',
    'SectionListDemo',
    'SimpleDemo',
    'SliderDemo',
    'SliderInListDemo',
    'SliderScrollDemo',
    'SliderStyleDemo',
    'Snake',
    'StatusBarDemo',
    'StickDemo',
    'StickyHeaderDemo',
    'StorageDemo',
    'SwitchDemo',
    'TextAnimationDemo',
    'TextDemo',
    'TSXDemo'
  ]

  build() {
    Column() {
      List() {
        ForEach(this.demos, (item: string) => {
          ListItem() {
            Text(item)
              .width('100%')
              .padding(15)
              .fontSize(18)
              .textAlign(TextAlign.Start)
              .onClick(() => {
                router.pushUrl({
                  url: 'pages/DoricPage',
                  params: {
                    source: item,
                    alias: item,
                    extra: '{}'
                  }
                })
              })
          }
        }, (item: string) => item)
      }
      .width('100%')
      .height('100%')
    }
    .width('100%')
    .height('100%')
  }
}
