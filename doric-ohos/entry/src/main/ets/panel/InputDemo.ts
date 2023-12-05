import {
  Panel,
  Group,
  scroller,
  vlayout,
  layoutConfig,
  LayoutSpec,
  Input,
  Color,
  input,
  text,
  log,
} from "doric";
import { preferenceView } from "./components/PreferenceView";
import { title } from "./utils";

function getInput(c: Partial<Input>) {
  const inputView = input(c);
  const isFocused = text({
    layoutConfig: {
      widthSpec: LayoutSpec.MOST,
      heightSpec: LayoutSpec.JUST,
    },
    height: 50,
  });
  const inputed = text({
    layoutConfig: {
      widthSpec: LayoutSpec.MOST,
      heightSpec: LayoutSpec.JUST,
    },
    height: 50,
  });
  inputView.onFocusChange = (onFocusChange) => {
    isFocused.text = onFocusChange ? `Focused` : `Unfocused`;
  };
  inputView.onTextChange = (text) => {
    inputed.text = `Inputed:${text}`;
  };
  inputView.onSubmitEditing = (text) => {
    inputed.text = `Submited: ${text}`
  };
  inputView.beforeTextChange = (change) => {
    log(`beforeTextChange  ${JSON.stringify(change)}`);
    return true;
  };



  return [
    inputView,
    isFocused,
    inputed,
  preferenceView().applyChild({
    title: {
      text: "Multiline"
    },
    switch: {
      state: true,
      onSwitch: (ret) => {
        inputView.multiline = ret
      }
    }
  }),
  preferenceView().applyChild({
    title: {
      text: "Editable"
    },
    switch: {
      state: true,
      onSwitch: (ret) => {
        inputView.editable = ret
      }
    }
  }),
  preferenceView().applyChild({
    title: {
      text: "maxLength"
    },
    switch: {
      state: true,
      onSwitch: (ret) => {
        inputView.maxLength = 20
      }
    }
  }),
  ];
}

export class InputDemo extends Panel {
  build(root: Group) {
    let inputView: Input
    scroller(
      vlayout(
        [
        title("Demo"),
          ...getInput({
            layoutConfig: {
              widthSpec: LayoutSpec.MOST,
              heightSpec: LayoutSpec.FIT,
            },
            hintText: "Please input something",
            border: {
              width: 1,
              color: Color.GRAY,
            },
            font: 'DINPro',
            hintFont: 'Hanabi',
            textColor: Color.RED,
            hintTextColor: Color.GREEN,
          }),
        ],
        {
          space: 10,
          layoutConfig: layoutConfig().most().configHeight(LayoutSpec.MOST),
        }
      ),
      {
        layoutConfig: layoutConfig().most(),
      }
    ).into(root);
  }
}
