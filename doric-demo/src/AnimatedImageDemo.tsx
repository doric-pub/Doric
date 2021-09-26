import {
  Panel,
  Group,
  jsx,
  VLayout,
  layoutConfig,
  Image,
  createRef,
  Gravity,
  ScaleType,
  Color,
  Text,
  modal,
} from "doric";
import { colors } from "./utils";

@Entry
export class AnimatedImageDemo extends Panel {
  build(root: Group) {
    const imageRef = createRef<Image>();
    <VLayout
      parent={root}
      layoutConfig={layoutConfig().most()}
      gravity={Gravity.Center}
      space={20}
    >
      <Image
        scaleType={ScaleType.ScaleToFill}
        ref={imageRef}
        imageUrl="https://upload.wikimedia.org/wikipedia/commons/1/14/Animated_PNG_example_bouncing_beach_ball.png"
      />
      <Text
        textSize={20}
        backgroundColor={colors[0]}
        textColor={Color.WHITE}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        onClick={async () => {
          const isAnimating = await imageRef.current.isAnimating(context);
          modal(context).alert(`Is Animating: ${isAnimating}`);
        }}
      >
        isAnimating
      </Text>
      <Text
        textSize={20}
        backgroundColor={colors[0]}
        textColor={Color.WHITE}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        onClick={() => {
          imageRef.current.startAnimating(context);
        }}
      >
        startAnimating
      </Text>
      <Text
        textSize={20}
        backgroundColor={colors[0]}
        textColor={Color.WHITE}
        padding={{ left: 10, top: 10, right: 10, bottom: 10 }}
        onClick={() => {
          imageRef.current.stopAnimating(context);
        }}
      >
        stopAnimating
      </Text>
    </VLayout>;
  }
}
