import {
  jsx,
  VLayout,
  Panel,
  Gravity,
  Group,
  layoutConfig,
  Text,
  makeRef,
  Stack,
  Color,
  modal,
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
      layoutConfig={layoutConfig().fit().configAlignment(Gravity.Center)}
      parent={root}
    >
      <Text textSize={40} ref={ref}>
        {`${count}`}
      </Text>
      <Text
        textSize={20}
        text="Click to count"
        onClick={() => {
          count++;
          ref.current.text = `${count}`;
        }}
      ></Text>
      {fragments}
      {fragments}
      {[0, 1, 2, 3].map((i) => (
        <Text text={`Index ${i}`} />
      ))}
    </VLayout>;
  }
}
