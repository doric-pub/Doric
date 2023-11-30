import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  text,
  Text,
  Color,
  navbar,
  AssetsResource,
  image
} from "doric";

export class HelloDoric extends Panel {
  onShow() {
    navbar(this.context).setTitle("doric-arkui")
  }

  build(rootView: Group): void {
    let number: Text;
    let count = 0;
    let container = vlayout([
      number = text({
        textSize: 40,
        text: '0',
      }),
    text({
      text: "Click to count",
      textSize: 20,
      backgroundColor: Color.parse('#70a1ff'),
      textColor: Color.WHITE,
      onClick: () => {
        number.text = `${++count}`
      },
      layoutConfig: layoutConfig().just(),
      width: 200,
      height: 50,
    }),
    ])
      .apply({
        layoutConfig: layoutConfig().just().configAlignment(Gravity.Center),
        width: 200,
        height: 200,
        space: 20,
        border: {
          color: Color.BLUE,
          width: 1,
        },
        gravity: Gravity.Center,
        onClick: () => {
          container.addChild(text({
            text: `This is new ${count++}`
          }))
        },
        backgroundColor:Color.YELLOW
      })
      .into(rootView)
    setInterval(() => {
      number.text = `${++count}`
    }, 1000)
  }
}