import {
  jsx,
  VLayout,
  HLayout,
  Panel,
  Gravity,
  Group,
  layoutConfig,
  Text,
  createRef,
  Color,
  loge,
} from "doric";

@Entry
class Counter extends Panel {
  build(root: Group) {
    root.backgroundColor = Color.BLACK;
    const hour1Ref = createRef<Text>();
    const hour2Ref = createRef<Text>();
    const min1Ref = createRef<Text>();
    const min2Ref = createRef<Text>();
    const sec1Ref = createRef<Text>();
    const sec2Ref = createRef<Text>();
    const comm1Ref = createRef<Text>();
    const comm2Ref = createRef<Text>();

    <VLayout
      space={20}
      gravity={Gravity.Center}
      layoutConfig={layoutConfig().fit().configAlignment(Gravity.Center)}
      parent={root}
    >
      <HLayout space={5}>
        <Text
          textSize={40}
          ref={hour1Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
        <Text
          textSize={40}
          ref={hour2Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
        <Text
          ref={comm1Ref}
          textColor={Color.WHITE}
          textSize={40}
          padding={{ top: 10, bottom: 10 }}
        >
          :
        </Text>
        <Text
          textSize={40}
          ref={min1Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
        <Text
          textSize={40}
          ref={min2Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
        <Text
          ref={comm2Ref}
          textSize={40}
          textColor={Color.WHITE}
          padding={{ top: 10, bottom: 10 }}
        >
          :
        </Text>
        <Text
          textSize={40}
          ref={sec1Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
        <Text
          textSize={40}
          ref={sec2Ref}
          textColor={Color.WHITE}
          border={{ width: 1, color: Color.BLUE }}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          0
        </Text>
      </HLayout>
    </VLayout>;

    this.addOnRenderFinishedCallback(async () => {
      const width = await root.getWidth(this.context);
      [
        hour1Ref,
        hour2Ref,
        comm1Ref,
        min1Ref,
        min2Ref,
        comm2Ref,
        sec1Ref,
        sec2Ref,
      ].forEach((e) => {
        e.current.apply({
          border: undefined,
          textSize: width / 10,
        });
      });
    });
    setInterval(() => {
      const time = new Date();
      hour1Ref.current.text = `${Math.floor(time.getHours() / 10)}`;
      hour2Ref.current.text = `${Math.floor(time.getHours() % 10)}`;

      min1Ref.current.text = `${Math.floor(time.getMinutes() / 10)}`;
      min2Ref.current.text = `${Math.floor(time.getMinutes() % 10)}`;

      sec1Ref.current.text = `${Math.floor(time.getSeconds() / 10)}`;
      sec2Ref.current.text = `${Math.floor(time.getSeconds() % 10)}`;
    }, 100);
  }
}
