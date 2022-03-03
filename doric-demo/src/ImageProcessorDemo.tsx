import {
  Group,
  Panel,
  jsx,
  Color,
  layoutConfig,
  Image,
  Scroller,
  VLayout,
  Text,
  Gravity,
  createRef,
  loge,
  ViewComponent,
  HLayout,
  Stack,
  GestureContainer,
} from "doric";
import {
  binarization,
  extractGrayValue,
  fastBlur,
  gaussianBlur,
  ostu,
  pixelToRGBA,
  vampix,
} from "./imageUtils";
import { colors } from "./utils";

@ViewComponent
export class Label extends Text {
  constructor() {
    super();
    this.width = 100;
    this.height = 40;
    this.backgroundColor = colors[1];
    this.textColor = Color.WHITE;
    this.textSize = 20;
  }
}

@Entry
export class ImageProcessorDemo extends Panel {
  build(root: Group): void {
    const iv = createRef<Image>();
    const imageUrl = "https://doric.pub/about/The_Parthenon_in_Athens.jpg";
    let imageInfo: { width: number; height: number };
    let pixels: ArrayBuffer;
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        gravity={Gravity.Center}
      >
        <Text
          layoutConfig={layoutConfig().mostWidth().justHeight()}
          textSize={30}
          textColor={Color.WHITE}
          backgroundColor={colors[5]}
          textAlignment={Gravity.Center}
          height={50}
        >
          图片处理
        </Text>
        <Image
          ref={iv}
          layoutConfig={layoutConfig().justWidth().fitHeight()}
          width={(Environment.screenWidth / 5) * 4}
          imageUrl={imageUrl}
          loadCallback={async () => {
            imageInfo = await iv.current.getImageInfo(context);
            pixels = (await iv.current.getImagePixels(context)).slice(0);
          }}
        />
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
        >
          <Label
            backgroundColor={Color.RED}
            layoutConfig={layoutConfig().just()}
            onClick={async () => {
              iv.current.imageUrl = undefined;
              iv.current.imageUrl = imageUrl;
            }}
          >
            重置
          </Label>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[4].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>透明度</Text>
          {(() => {
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              async function changeAlpha(alpha: number) {
                const data = new Uint8Array(pixels);
                for (let i = 0; i < data.length - 4; i += 4) {
                  data[i + 3] = alpha;
                }
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }
              const width = await containerRef.current.getWidth(this.context);
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                await changeAlpha((1 - event.x / width) * 0xff);
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                await changeAlpha((1 - event.x / width) * 0xff);
              };
            });
            return (
              <GestureContainer
                layoutConfig={layoutConfig().mostWidth().fitHeight()}
                ref={containerRef}
                border={{
                  width: 1,
                  color: colors[0],
                }}
              >
                <Stack
                  ref={spinnerRef}
                  backgroundColor={colors[4]}
                  layoutConfig={layoutConfig().justWidth().justHeight()}
                  height={40}
                ></Stack>
              </GestureContainer>
            );
          })()}
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[4].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>二值化</Text>
          {(() => {
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              let data: Uint32Array | undefined = undefined;
              async function binarizationImage(t: number) {
                if (!!!data) {
                  data = new Uint32Array(pixels);
                  for (let i = 0; i < data.length; i++) {
                    let { r, g, b } = pixelToRGBA(data[i]);
                    data[i] = Math.floor(r * 0.2989 + g * 0.587 + b * 0.114);
                  }
                }
                const arrayBuffer = pixels.slice(0);
                const ret = new Uint32Array(arrayBuffer);
                for (let i = 0; i < data.length; i++) {
                  ret[i] = data[i] < t ? 0xff000000 : 0xffffffff;
                }
                iv.current.setImagePixels(context, {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: arrayBuffer,
                });
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: arrayBuffer,
                };
              }
              const width = await containerRef.current.getWidth(this.context);
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                await binarizationImage((1 - event.x / width) * 0xff);
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                await binarizationImage((1 - event.x / width) * 0xff);
              };
            });
            return (
              <GestureContainer
                layoutConfig={layoutConfig().mostWidth().fitHeight()}
                ref={containerRef}
                border={{
                  width: 1,
                  color: colors[0],
                }}
              >
                <Stack
                  ref={spinnerRef}
                  backgroundColor={colors[4]}
                  layoutConfig={layoutConfig().justWidth().justHeight()}
                  height={40}
                ></Stack>
              </GestureContainer>
            );
          })()}
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[4].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>模糊</Text>
          {(() => {
            const spinnerRef = createRef<Stack>();
            const containerRef = createRef<GestureContainer>();
            this.addOnRenderFinishedCallback(async () => {
              async function blurEffect(radius: number) {
                radius = Math.round(radius);
                const buffer = pixels.slice(0);
                const data = new Uint32Array(buffer);
                fastBlur(data, imageInfo.width, imageInfo.height, radius);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: buffer,
                };
              }
              const width = await containerRef.current.getWidth(this.context);
              containerRef.current.onTouchDown = async (event) => {
                spinnerRef.current.width = event.x;
                await blurEffect((event.x / width) * 100);
              };
              containerRef.current.onTouchMove = async (event) => {
                spinnerRef.current.width = event.x;
                await blurEffect((event.x / width) * 100);
              };
            });
            return (
              <GestureContainer
                layoutConfig={layoutConfig().mostWidth().fitHeight()}
                ref={containerRef}
                border={{
                  width: 1,
                  color: colors[0],
                }}
              >
                <Stack
                  ref={spinnerRef}
                  backgroundColor={colors[4]}
                  layoutConfig={layoutConfig().justWidth().justHeight()}
                  height={40}
                ></Stack>
              </GestureContainer>
            );
          })()}
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[3].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>简单</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                const data = new Uint32Array(pixels);
                vampix(data);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              灰度
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                loge(imageInfo);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                loge(pixels.byteLength);
                const data = new Uint8Array(pixels);
                for (let i = 0; i < data.length - 4; i += 4) {
                  data[i + 3] = 0xff / 2;
                }
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              透明
            </Label>
          </HLayout>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[4].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>模糊</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                const data = new Uint32Array(pixels);
                fastBlur(data, imageInfo.width, imageInfo.height, 30);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              FastBlur
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                const data = new Uint32Array(pixels);
                gaussianBlur(data, imageInfo.width, imageInfo.height, 1);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              高斯模糊
            </Label>
          </HLayout>
        </VLayout>
        <VLayout
          layoutConfig={layoutConfig().mostWidth().fitHeight()}
          padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
          backgroundColor={colors[3].alpha(0.2)}
          space={5}
        >
          <Text textSize={20}>二值化</Text>
          <HLayout space={10}>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                const data = new Uint32Array(pixels);
                extractGrayValue(data);
                binarization(data, 127);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              普通
            </Label>
            <Label
              layoutConfig={layoutConfig().just()}
              onClick={async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = (await iv.current.getImagePixels(context)).slice(
                  0
                );
                const data = new Uint32Array(pixels);
                extractGrayValue(data);
                const t = ostu(data);
                binarization(data, t);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              }}
            >
              OSTU
            </Label>
          </HLayout>
        </VLayout>
      </VLayout>
    </Scroller>;
  }
}
