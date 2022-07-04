import { Text, Group, Panel, jsx, VLayout, layoutConfig, HLayout } from "doric";

function CellItem(props: { text: string }) {
  return (
    <HLayout layoutConfig={layoutConfig().mostWidth().justHeight()} height={50}>
      <Text>{props.text}</Text>
    </HLayout>
  );
}

@Entry
class FunctionalComponentDemo extends Panel {
  build(root: Group) {
    <VLayout layoutConfig={layoutConfig().most()} parent={root}>
      <CellItem text="Cell0"></CellItem>
      <CellItem text="Cell1"></CellItem>
      <CellItem text="Cell2"></CellItem>
    </VLayout>;
  }
}
