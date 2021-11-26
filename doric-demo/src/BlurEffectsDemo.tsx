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
  Stack,
  Color,
  GestureContainer,
  Scroller,
  Gravity,
  HLayout,
} from "doric";
import { colors } from "./utils";

@Entry
export class BlurEffectsDemo extends Panel {
  build(root: Group) {
    root.backgroundColor = Color.WHITE;
    const blurEffectRef = createRef<BlurEffect>();
    const gestureRef = createRef<GestureContainer>();
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout layoutConfig={layoutConfig().mostWidth().fitHeight()}>
        <BlurEffect
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          radius={20}
          ref={blurEffectRef}
          effectiveRect={{
            x: 50,
            y: 50,
            width: 200,
            height: 200,
          }}
        >
          <GestureContainer
            ref={gestureRef}
            layoutConfig={layoutConfig().mostWidth().fitHeight()}
          >
            <VLayout space={20} padding={{ left: 5, right: 5 }}>
              <Image imageUrl="https://doric.pub/about/The_Parthenon_in_Athens.jpg" />
              <HLayout space={10}>
                <Image imageUrl="https://doric.pub/logo.png" />
                <Text
                  layoutConfig={layoutConfig().mostWidth().fitHeight()}
                  maxLines={-1}
                  textAlignment={Gravity.Left}
                >
                  希腊帕特农神庙历经数千年风雨侵蚀，早已断墙残垣。然而那些廊柱屹立千年，仍然坚固巍然。
                  这种廊柱样式叫做 Doric，即我们这个项目的名称由来。
                  正如Doric样式的廊柱撑起了神庙的千年风雨，我们也希望Doric项目能够作为前端页面的支柱，简洁，可靠。
                  目前Doric正在持续迭代中。如果您对Doric项目感兴趣，欢迎加入我们。
                </Text>
              </HLayout>
            </VLayout>
          </GestureContainer>
        </BlurEffect>
        <VLayout
          layoutConfig={layoutConfig()
            .mostWidth()
            .fitHeight()
            .configMargin({ top: 20 })}
          space={5}
          padding={{ left: 10, right: 10 }}
        >
          {(() => {
            const labelRef = createRef<Text>();
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              const width = await containerRef.current.getWidth(this.context);
              const maxValue = 25;
              spinnerRef.current.width =
                ((blurEffectRef.current.radius || 0) * width) / maxValue;
              labelRef.current.text = `Blur radius: ${blurEffectRef.current.radius}`;
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.radius = Math.round(
                  (event.x / width) * maxValue
                );
                labelRef.current.text = `Blur radius: ${blurEffectRef.current.radius}`;
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.radius = Math.round(
                  (event.x / width) * maxValue
                );
                labelRef.current.text = `Blur radius: ${blurEffectRef.current.radius}`;
              };
            });
            return (
              <>
                <Text textSize={20} ref={labelRef}>
                  Blur radius:\t
                </Text>
                <GestureContainer
                  layoutConfig={layoutConfig().mostWidth().fitHeight()}
                  ref={containerRef}
                  border={{
                    width: 1,
                    color: colors[4],
                  }}
                >
                  <Stack
                    ref={spinnerRef}
                    backgroundColor={colors[6]}
                    layoutConfig={layoutConfig().justWidth().justHeight()}
                    height={40}
                  ></Stack>
                </GestureContainer>
              </>
            );
          })()}
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig()
            .mostWidth()
            .fitHeight()
            .configMargin({ top: 20 })}
          space={5}
          padding={{ left: 10, right: 10 }}
        >
          {(() => {
            const labelRef = createRef<Text>();
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              const width = await containerRef.current.getWidth(this.context);
              const maxValue = await blurEffectRef.current.getWidth(
                this.context
              );
              spinnerRef.current.width =
                ((blurEffectRef.current.effectiveRect?.width || 0) * width) /
                maxValue;
              labelRef.current.text = `Effective Width: ${blurEffectRef.current.effectiveRect?.width}`;
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.effectiveRect = {
                  ...blurEffectRef.current.effectiveRect!!,
                  width: Math.floor((event.x / width) * maxValue),
                };
                labelRef.current.text = `Effective Width: ${blurEffectRef.current.effectiveRect?.width}`;
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.effectiveRect = {
                  ...blurEffectRef.current.effectiveRect!!,
                  width: Math.floor((event.x / width) * maxValue),
                };
                labelRef.current.text = `Effective Width: ${blurEffectRef.current.effectiveRect?.width}`;
              };
            });
            return (
              <>
                <Text textSize={20} ref={labelRef} />
                <GestureContainer
                  layoutConfig={layoutConfig().mostWidth().fitHeight()}
                  ref={containerRef}
                  border={{
                    width: 1,
                    color: colors[4],
                  }}
                >
                  <Stack
                    ref={spinnerRef}
                    backgroundColor={colors[6]}
                    layoutConfig={layoutConfig().justWidth().justHeight()}
                    height={40}
                  ></Stack>
                </GestureContainer>
              </>
            );
          })()}
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig()
            .mostWidth()
            .fitHeight()
            .configMargin({ top: 20 })}
          space={5}
          padding={{ left: 10, right: 10 }}
        >
          {(() => {
            const labelRef = createRef<Text>();
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              const width = await containerRef.current.getWidth(this.context);
              const maxValue = await blurEffectRef.current.getHeight(
                this.context
              );
              spinnerRef.current.width =
                ((blurEffectRef.current.effectiveRect?.height || 0) * width) /
                maxValue;
              labelRef.current.text = `Effective Height: ${blurEffectRef.current.effectiveRect?.height}`;
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.effectiveRect = {
                  ...blurEffectRef.current.effectiveRect!!,
                  height: Math.floor((event.x / width) * maxValue),
                };
                labelRef.current.text = `Effective Height: ${blurEffectRef.current.effectiveRect?.height}`;
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                blurEffectRef.current.effectiveRect = {
                  ...blurEffectRef.current.effectiveRect!!,
                  height: Math.floor((event.x / width) * maxValue),
                };
                labelRef.current.text = `Effective Height: ${blurEffectRef.current.effectiveRect?.height}`;
              };
            });
            return (
              <>
                <Text textSize={20} ref={labelRef} />
                <GestureContainer
                  layoutConfig={layoutConfig().mostWidth().fitHeight()}
                  ref={containerRef}
                  border={{
                    width: 1,
                    color: colors[4],
                  }}
                >
                  <Stack
                    ref={spinnerRef}
                    backgroundColor={colors[6]}
                    layoutConfig={layoutConfig().justWidth().justHeight()}
                    height={40}
                  ></Stack>
                </GestureContainer>
              </>
            );
          })()}
        </VLayout>
      </VLayout>
    </Scroller>;
    this.addOnRenderFinishedCallback(() => {
      let x = 0,
        y = 0,
        posX = 0,
        posY = 0;
      gestureRef.current.onTouchDown = (event) => {
        const rect = blurEffectRef.current.effectiveRect || {
          x: 0,
          y: 0,
          width: 0,
          height: 0,
        };
        if (
          event.x >= rect.x &&
          event.x <= rect.x + rect.width &&
          event.y >= rect.y &&
          event.y <= rect.y + rect.height
        ) {
          x = event.x;
          y = event.y;
          posX = rect.x;
          posY = rect.y;
        } else {
          x = -1;
        }
      };
      gestureRef.current.onTouchMove = (event) => {
        if (x >= 0) {
          blurEffectRef.current.effectiveRect = {
            ...blurEffectRef.current.effectiveRect!!,
            x: posX + (event.x - x),
            y: posY + (event.y - y),
          };
        }
      };
    });
  }
}
