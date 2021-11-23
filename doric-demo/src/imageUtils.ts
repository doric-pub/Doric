export function pixelToRGBA(pixel: number) {
    const r = pixel & 0xff;
    const g = (pixel >> 8) & 0xff;
    const b = (pixel >> 16) & 0xff;
    const a = (pixel >> 24) & 0xff;
    return { r, g, b, a };
}

export function rgbaToPixel(rgba: { r: number; g: number; b: number; a: number }) {
    return (
        (rgba.r & 0xff) +
        ((rgba.g & 0xff) << 8) +
        ((rgba.b & 0xff) << 16) +
        ((rgba.a & 0xff) << 24)
    );
}

export function extractGrayValue(pixels: Uint32Array) {
    for (let i = 0; i < pixels.length; i++) {
        let { r, g, b } = pixelToRGBA(pixels[i]);
        pixels[i] = Math.floor(r * 0.2989 + g * 0.587 + b * 0.114);
    }
    return pixels
}

export function ostu(grayData: Uint32Array | Array<number>) {
    let threshold = 1;
    let start = 0,
        duration = 0xff;
    const records: Record<number, number> = {};

    function compute(t: number) {
        if (records[t] != undefined) {
            return records[t];
        }
        let u0 = 0;
        let u1 = 0;
        let n0: number[] = [];
        let n1: number[] = [];
        for (let e of grayData) {
            if (e < t) {
                u0 += e;
                n0.push(e);
            } else {
                u1 += e;
                n1.push(e);
            }
        }
        const w0 = n0.length;
        const w1 = n1.length;
        u0 /= w0;
        u1 /= w1;
        const ret = w0 * w1 * (u0 - u1) * (u0 - u1);
        records[t] = ret;
        return ret;
    }

    while (duration >= 2) {
        threshold = start + Math.floor(duration / 2);
        const g = compute(threshold);
        const g1 = compute(threshold - 1);
        if (g1 < g) {
            const g2 = compute(threshold + 1);
            if (g < g2) {
                duration = start + duration - threshold;
                start = threshold;
            } else {
                break;
            }
        } else {
            duration = threshold - start;
        }
    }
    return threshold;
}

export function vampix(pixels: Uint32Array | Array<number>) {
    for (let i = 0; i < pixels.length; i++) {
        let { r, g, b, a } = pixelToRGBA(pixels[i]);
        r = g = b = Math.floor(r * 0.2989 + g * 0.587 + b * 0.114);
        pixels[i] = rgbaToPixel({ r, g, b, a });
    }
}

export function binarization(pixels: Uint32Array | Array<number>, threshold: number) {
    for (let i = 0; i < pixels.length; i++) {
        pixels[i] = pixels[i] < threshold ? 0xff000000 : 0xffffffff;
    }
}

export function fastBlur(
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

export function gaussianBlur(pixels: Uint32Array | Array<number>,
    w: number,
    h: number,
    radius: number) {
    function getPixel(x: number, y: number) {
        return pixels[
            Math.max(0, Math.min(x, w - 1)) +
            Math.max(0, Math.min(y, h - 1)) *
            w
        ];
    }
    function gaussian(x: number, y: number) {
        const q = 1.5;
        return (
            (1 / (2 * Math.PI * q * q)) *
            Math.exp(-(x * x + y * y) / (2 * q * q))
        );
    }
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

    for (let j = 0; j < h; j++) {
        for (let i = 0; i < w; i++) {
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
            pixels[i + j * w] = rgbaToPixel(rgba);
        }
    }
}