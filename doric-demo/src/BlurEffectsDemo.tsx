import {
  VLayout,
  Group,
  Panel,
  jsx,
  layoutConfig,
  BlurEffect,
  Image,
  Text,
  createRef,
  animate,
  loge,
  Stack,
  RotationXAnimation,
  RotationAnimation,
} from "doric";

@Entry
export class BlurEffectsDemo extends Panel {
  build(root: Group) {
    let ref = createRef<Image>();
    <VLayout layoutConfig={layoutConfig().most()} parent={root}>
      <BlurEffect layoutConfig={layoutConfig().most()} radius={15}>
        <Image
          ref={ref}
          imageUrl="https://pic3.zhimg.com/v2-5847d0813bd0deba333fcbe52435e83e_b.jpg"
          onClick={async () => {
            const rotation = new RotationAnimation();
            rotation.fromRotation = 0;
            rotation.toRotation = 2;
            rotation.duration = 1000;
            rotation.repeatCount = -1;
            ref.current.doAnimation(context, rotation);
          }}
        />
      </BlurEffect>
    </VLayout>;
  }
}
