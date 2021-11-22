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
} from "doric";
import { colors } from "./utils";

function fastBlur(
  pixels: Uint32Array | Array<number>,
  w: number,
  h: number,
  radius: number
) {
  const wm = w - 1;
  const hm = h - 1;
  const wh = w * h;
  const div = 2 * radius + 1;
  const r: number[] = new Array(wh);
  const g: number[] = new Array(wh);
  const b: number[] = new Array(wh);
  let rsum = 0,
    gsum = 0,
    bsum = 0,
    x,
    y,
    i,
    p,
    yp,
    yi,
    yw;
  const vmin: number[] = new Array(Math.max(w, h));
  let divsum = (div + 1) >> 1;
  divsum *= divsum;
  const dv: number[] = new Array(256 * divsum);
  for (i = 0; i < 256 * divsum; i++) {
    dv[i] = Math.round(i / divsum);
  }

  yw = yi = 0;

  const stack = new Array(div).fill(0).map((_) => new Array(3));
  let stackpointer;
  let stackstart;
  let sir: number[];
  let rbs;
  let r1 = radius + 1;
  let routsum, goutsum, boutsum;
  let rinsum, ginsum, binsum;

  for (y = 0; y < h; y++) {
    rinsum =
      ginsum =
      binsum =
      routsum =
      goutsum =
      boutsum =
      rsum =
      gsum =
      bsum =
        0;
    for (i = -radius; i <= radius; i++) {
      p = pixels[yi + Math.min(wm, Math.max(i, 0))];
      sir = stack[i + radius];
      sir[0] = p & 0xff;
      sir[1] = (p >> 8) & 0xff;
      sir[2] = (p >> 16) & 0xff;
      rbs = r1 - Math.abs(i);
      rsum += sir[0] * rbs;
      gsum += sir[1] * rbs;
      bsum += sir[2] * rbs;
      if (i > 0) {
        rinsum += sir[0];
        ginsum += sir[1];
        binsum += sir[2];
      } else {
        routsum += sir[0];
        goutsum += sir[1];
        boutsum += sir[2];
      }
    }
    stackpointer = radius;

    for (x = 0; x < w; x++) {
      r[yi] = dv[rsum];
      g[yi] = dv[gsum];
      b[yi] = dv[bsum];

      rsum -= routsum;
      gsum -= goutsum;
      bsum -= boutsum;

      stackstart = stackpointer - radius + div;
      sir = stack[stackstart % div];

      routsum -= sir[0];
      goutsum -= sir[1];
      boutsum -= sir[2];

      if (y == 0) {
        vmin[x] = Math.min(x + radius + 1, wm);
      }
      p = pixels[yw + vmin[x]];

      sir[0] = p & 0xff;
      sir[1] = (p >> 8) & 0xff;
      sir[2] = (p >> 16) & 0xff;

      rinsum += sir[0];
      ginsum += sir[1];
      binsum += sir[2];

      rsum += rinsum;
      gsum += ginsum;
      bsum += binsum;

      stackpointer = (stackpointer + 1) % div;
      sir = stack[stackpointer % div];

      routsum += sir[0];
      goutsum += sir[1];
      boutsum += sir[2];

      rinsum -= sir[0];
      ginsum -= sir[1];
      binsum -= sir[2];

      yi++;
    }
    yw += w;
  }
  for (x = 0; x < w; x++) {
    rinsum =
      ginsum =
      binsum =
      routsum =
      goutsum =
      boutsum =
      rsum =
      gsum =
      bsum =
        0;
    yp = -radius * w;
    for (i = -radius; i <= radius; i++) {
      yi = Math.max(0, yp) + x;

      sir = stack[i + radius];

      sir[0] = r[yi];
      sir[1] = g[yi];
      sir[2] = b[yi];

      rbs = r1 - Math.abs(i);

      rsum += r[yi] * rbs;
      gsum += g[yi] * rbs;
      bsum += b[yi] * rbs;

      if (i > 0) {
        rinsum += sir[0];
        ginsum += sir[1];
        binsum += sir[2];
      } else {
        routsum += sir[0];
        goutsum += sir[1];
        boutsum += sir[2];
      }

      if (i < hm) {
        yp += w;
      }
    }
    yi = x;
    stackpointer = radius;
    for (y = 0; y < h; y++) {
      pixels[yi] =
        dv[rsum] |
        ((dv[gsum] & 0xff) << 8) |
        ((dv[bsum] & 0xff) << 16) |
        (pixels[yi] & 0xff000000);
      rsum -= routsum;
      gsum -= goutsum;
      bsum -= boutsum;

      stackstart = stackpointer - radius + div;
      sir = stack[stackstart % div];

      routsum -= sir[0];
      goutsum -= sir[1];
      boutsum -= sir[2];

      if (x == 0) {
        vmin[y] = Math.min(y + r1, hm) * w;
      }
      p = x + vmin[y];

      sir[0] = r[p];
      sir[1] = g[p];
      sir[2] = b[p];

      rinsum += sir[0];
      ginsum += sir[1];
      binsum += sir[2];

      rsum += rinsum;
      gsum += ginsum;
      bsum += binsum;

      stackpointer = (stackpointer + 1) % div;
      sir = stack[stackpointer];

      routsum += sir[0];
      goutsum += sir[1];
      boutsum += sir[2];

      rinsum -= sir[0];
      ginsum -= sir[1];
      binsum -= sir[2];

      yi += w;
    }
  }
}

function pixelToRGBA(pixel: number) {
  const r = pixel & 0xff;
  const g = (pixel >> 8) & 0xff;
  const b = (pixel >> 16) & 0xff;
  const a = (pixel >> 24) & 0xff;
  return { r, g, b, a };
}

function rgbaToPixel(rgba: { r: number; g: number; b: number; a: number }) {
  return (
    (rgba.r & 0xff) +
    ((rgba.g & 0xff) << 8) +
    ((rgba.b & 0xff) << 16) +
    ((rgba.a & 0xff) << 24)
  );
}

@Entry
export class ImageProcessorDemo extends Panel {
  build(root: Group): void {
    const iv = createRef<Image>();
    const imageUrl = "https://doric.pub/about/The_Parthenon_in_Athens.jpg"; //"https://doric.pub/logo.png";
    <Scroller parent={root} layoutConfig={layoutConfig().most()}>
      <VLayout
        layoutConfig={layoutConfig().mostWidth().fitHeight()}
        space={20}
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
        />
        {(
          [
            [
              "黑白",
              async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                for (let i = 0; i < data.length; i++) {
                  let { r, g, b, a } = pixelToRGBA(data[i]);
                  r = g = b = Math.floor(r * 0.2989 + g * 0.587 + b * 0.114);
                  data[i] = rgbaToPixel({ r, g, b, a });
                }
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              },
            ],
            [
              "FastBlur",
              async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                fastBlur(data, imageInfo.width, imageInfo.height, 30);
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              },
            ],
            [
              "高斯模糊",
              async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                loge(imageInfo);
                const pixels = await iv.current.getImagePixels(context);
                const data = new Uint32Array(pixels);
                function getPixel(x: number, y: number) {
                  return data[
                    Math.max(0, Math.min(x, imageInfo.width - 1)) +
                      Math.max(0, Math.min(y, imageInfo.height - 1)) *
                        imageInfo.width
                  ];
                }
                function gaussian(x: number, y: number) {
                  const q = 1.5;
                  return (
                    (1 / (2 * Math.PI * q * q)) *
                    Math.exp(-(x * x + y * y) / (2 * q * q))
                  );
                }
                const radius = 1;
                const weights: number[][] = new Array(radius * 2 + 1)
                  .fill(0)
                  .map((_) => new Array(radius * 2 + 1).fill(0));
                let allWeight = 0;
                for (let x = 0; x < radius * 2 + 1; x++) {
                  for (let y = 0; y < radius * 2 + 1; y++) {
                    weights[x][y] = gaussian(x - radius, y - radius);
                    allWeight += weights[x][y];
                  }
                }

                for (let x = 0; x < radius * 2 + 1; x++) {
                  for (let y = 0; y < radius * 2 + 1; y++) {
                    weights[x][y] = weights[x][y] / allWeight;
                  }
                }

                for (let j = 0; j < imageInfo.height; j++) {
                  for (let i = 0; i < imageInfo.width; i++) {
                    const rgba = { r: 0, g: 0, b: 0, a: 0 };
                    for (let lx = 0; lx < radius * 2 + 1; lx++) {
                      for (let ly = 0; ly < radius * 2 + 1; ly++) {
                        const { r, g, b, a } = pixelToRGBA(
                          getPixel(lx - radius + i, ly - radius + j)
                        );
                        rgba.r += r * weights[lx][ly];
                        rgba.g += g * weights[lx][ly];
                        rgba.b += b * weights[lx][ly];
                        rgba.a += a * weights[lx][ly];
                      }
                    }
                    data[i + j * imageInfo.width] = rgbaToPixel(rgba);
                  }
                }
                iv.current.imagePixels = {
                  width: imageInfo.width,
                  height: imageInfo.height,
                  pixels: pixels,
                };
              },
            ],
            [
              "透明",
              async () => {
                const imageInfo = await iv.current.getImageInfo(context);
                loge(imageInfo);
                const pixels = await iv.current.getImagePixels(context);
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
              },
            ],
            [
              "重置",
              async () => {
                iv.current.imageUrl = undefined;
                iv.current.imageUrl = imageUrl;
              },
            ],
          ] as [string, () => {}][]
        ).map((e) => (
          <Text
            layoutConfig={layoutConfig().just()}
            width={100}
            height={40}
            backgroundColor={colors[1]}
            textColor={Color.WHITE}
            textSize={20}
            onClick={e[1]}
          >
            {e[0]}
          </Text>
        ))}
      </VLayout>
    </Scroller>;
  }
}
