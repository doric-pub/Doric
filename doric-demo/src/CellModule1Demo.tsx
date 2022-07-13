import {
  Panel,
  Group,
  jsx,
  VLayout,
  Image,
  Text,
  layoutConfig,
  HLayout,
  Gravity,
  Color,
  createRef,
} from "doric";

@Entry
export class Cell1 extends Panel {
  imageRef = createRef<Image>();
  titleRef = createRef<Text>();
  contentRef = createRef<Text>();
  data?: { imageUrl: string; title: string; content: string };

  build(root: Group) {
    <VLayout parent={root} layoutConfig={layoutConfig().most()} space={20}>
      <Text
        layoutConfig={layoutConfig().mostWidth().justHeight()}
        textSize={16}
        height={30}
        textAlignment={Gravity.Center}
        textColor={Color.WHITE}
        backgroundColor={Color.parse("#1abc9c")}
      >
        模块1样式
      </Text>
      <HLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        padding={{ left: 15, right: 15, bottom: 15 }}
      >
        <Image
          ref={this.imageRef}
          layoutConfig={layoutConfig().just()}
          width={80}
          height={80}
          imageUrl="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202105%2F29%2F20210529001057_aSeLB.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=58adafcc2e68fd90e83991ebcec99b50"
        />
        <VLayout
          layoutConfig={layoutConfig()
            .fitHeight()
            .configWeight(1)
            .configMargin({ left: 20 })}
          space={10}
        >
          <Text
            ref={this.titleRef}
            layoutConfig={layoutConfig().fitHeight().mostWidth()}
            textSize={20}
            textAlignment={Gravity.Left}
          >
            标题文本
          </Text>
          <Text
            ref={this.contentRef}
            layoutConfig={layoutConfig().fitHeight().mostWidth()}
            maxLines={0}
            textSize={12}
            textAlignment={Gravity.Left}
          >
            这是一段多行的文本 这是一段多行的文本 这是一段多行的文本
            这是一段多行的文本 这是一段多行的文本 这是一段多行的文本
          </Text>
        </VLayout>
      </HLayout>
    </VLayout>;
    if (this.data) {
      this.setData(this.data);
    }
  }
  //从客户端直接调用方法
  setData(data: { imageUrl: string; title: string; content: string }) {
    this.data = data;
    if (
      this.imageRef.current &&
      this.titleRef.current &&
      this.contentRef.current
    ) {
      const { imageUrl, title, content } = data;
      this.imageRef.current.imageUrl = imageUrl;
      this.titleRef.current.text = title;
      this.contentRef.current.text = content;
    }
  }
}
