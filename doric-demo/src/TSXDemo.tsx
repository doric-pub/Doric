import {
  jsx,
  VLayout,
  Panel,
  Gravity,
  Group,
  LayoutSpec,
  Text,
  makeRef,
} from "doric";

function createFragment() {
  return (
    <>
      <Text text="This is line 1 in fragment"></Text>
      <Text text="This is line 2 in fragment"></Text>
    </>
  );
}

@Entry
class Counter extends Panel {
  build(root: Group) {
    const fragments = createFragment();
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
      {fragments}
      {[0, 1, 2, 3].map((i) => (
        <>
          <Text text={`Index ${i}`} />
          <Text text={`Subtitle ${i}`} textSize={10} />
        </>
      ))}
    </VLayout>;
  }
}
