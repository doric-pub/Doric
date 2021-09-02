import {
  jsx,
  VLayout,
  Panel,
  Gravity,
  Group,
  LayoutSpec,
  Image,
  Text,
  makeRef,
} from "doric";

// class MyPanel extends Panel {
//   build(root: Group) {
//     <VLayout
//       space={20}
//       gravity={Gravity.Center}
//       layoutConfig={{
//         widthSpec: LayoutSpec.MOST,
//         heightSpec: LayoutSpec.MOST,
//       }}
//       parent={root}
//     >
//       <Image imageUrl="https://doric.pub/logo.png" />
//       <Text text="Hello,Doric" textSize={20} />
//     </VLayout>;
//   }
// }

@Entry
class Counter extends Panel {
  build(root: Group) {
    const ref = makeRef<Text>();
    let count = 0;
    <VLayout
      space={20}
      gravity={Gravity.Center}
      layoutConfig={{
        widthSpec: LayoutSpec.MOST,
        heightSpec: LayoutSpec.MOST,
      }}
      parent={root}
    >
      <Text text={`${count}`} textSize={40} ref={ref} />
      <Text
        text="Click to count"
        textSize={20}
        onClick={() => {
          count++;
          ref.current.text = `${count}`;
        }}
      />
    </VLayout>;
  }
}
