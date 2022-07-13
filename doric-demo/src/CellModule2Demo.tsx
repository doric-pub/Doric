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
  Ref,
} from "doric";

@Entry
export class Cell2 extends Panel {
  imageRef?: Ref<Image>;
  titleRef?: Ref<Text>;
  contentRef?: Ref<Text>;

  data?: { imageUrl: string; title: string; content: string };

  build(root: Group) {
    this.imageRef = createRef<Image>();
    this.titleRef = createRef<Text>();
    this.contentRef = createRef<Text>();
    <VLayout parent={root} layoutConfig={layoutConfig().most()} space={20}>
      <Text
        layoutConfig={layoutConfig().mostWidth().justHeight()}
        textSize={16}
        height={30}
        textAlignment={Gravity.Center}
        textColor={Color.WHITE}
        backgroundColor={Color.parse("#f1c40f")}
      >
        模块2样式
      </Text>
      <HLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        padding={{ left: 15, right: 15, bottom: 15 }}
      >
        <VLayout
          layoutConfig={layoutConfig()
            .fitHeight()
            .configWeight(1)
            .configMargin({ right: 20 })}
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
        <Image
          ref={this.imageRef}
          layoutConfig={layoutConfig().just()}
          width={80}
          height={80}
          imageUrl="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F202009%2F23%2F20200923185609_rQUdj.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660279617&t=5084c8fff0c25f8cf5e158867e57c126"
        />
      </HLayout>
    </VLayout>;
    if (this.data) {
      this.setData(this.data);
    }
  }
  //从客户端直接调用方法
  setData(data: { imageUrl: string; title: string; content: string }) {
    this.data = data;
    if (this.imageRef && this.titleRef && this.contentRef) {
      const { imageUrl, title, content } = data;
      this.imageRef.current.imageUrl = imageUrl;
      this.titleRef.current.text = title;
      this.contentRef.current.text = content;
    }
  }
}
