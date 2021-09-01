import {
  Panel,
  Group,
  VLayout,
  layoutConfig,
  Gravity,
  Text,
  Color,
  navbar,
  jsx,
} from "doric";

@Entry
class Example extends Panel {
  onShow() {
    navbar(context).setTitle("Example");
  }
  build(rootView: Group) {
    let count = 0;
    (
      <VLayout
        layoutConfig={layoutConfig().just().configAlignment(Gravity.Center)}
        width={200}
        height={200}
        space={20}
        border={{ color: Color.BLUE, width: 1 }}
        gravity={Gravity.Center}
      >
        <Text
          tag="Label"
          text={`${count}`}
          textSize={40}
          layoutConfig={layoutConfig().fit()}
        />
        <Text
          text="Click to count"
          textSize={20}
          backgroundColor={Color.parse("#70a1ff")}
          textColor={Color.WHITE}
          onClick={() => {
            count++;
            const label = rootView.findViewByTag("Label") as Text;
            label.text = `${count}`;
          }}
          width={200}
          height={50}
        />
      </VLayout>
    ).in(rootView);
  }
}
