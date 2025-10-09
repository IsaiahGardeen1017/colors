
import sharp from 'sharp';
import { rgb24 } from '@std/fmt/colors';
import { block, colString } from './textfuncs.ts';
import { black } from '@std/fmt/colors';
import { color, colorToHsl, colorToRgb, rgbToHsl } from './palleteFuncs.ts';
import { randHsl } from './random.ts';
import { Buffer } from "node:buffer";

export type ColorStrategy = (y0: number, x0: number, ySize: number, xSize: number, pixels: color[][]) => color;


export function averageAll(y0: number, x0: number, ySize: number, xSize: number, pixels: color[][]): color {
    let rAvg = 0;
    let gAvg = 0;
    let bAvg = 0;
    let tot = 0;

    for (let y = y0; y < ySize; y++) {
        for (let x = x0; x < xSize; x++) {
            const c = colorToRgb(pixels[y][x]);
            tot++;
            rAvg += c.r;
            gAvg += c.g;
            bAvg += c.b;
        }
    }

    const rgb: color = {
        mode: 'rgb',
        r: (rAvg / tot) / 255,
        g: (gAvg / tot) / 255,
        b: (bAvg / tot) / 255,
    }


    return rgb;
}

export function sampleFirst(y0: number, x0: number, ySize: number, xSize: number, pixels: color[][]): color {

    return pixels[y0][x0];
}


export function getListOfValidColors(pixels: Buffer, channels: number): color[] {
    return [];
}

export function quantizeOnHSLFuncBuilder(hueSlices: number, satSlices: number, litSlices: number, sampleMode: 'average' | 'first'): ColorStrategy {
    
        if (sampleMode === 'average') {
            return averageAll;
        } else if (sampleMode === 'first') {
            return sampleFirst;
        }
}

export async function renderImage(imgBytes: Uint8Array, h: number, w: number, colorStrategy: ColorStrategy = sampleFirst, bonusArr?: color[]): Promise<string[]> {

    const allColorArray: color[] = bonusArr ?? [];
    let strs: string[] = [];

    const image = await sharp(imgBytes);

    const metadata = await image.metadata();
    const { width, height, channels } = metadata;

    const AVERAGE_GUESSED_CHAR_AP = 0.444;

    const aspectRatio = (width / height) / AVERAGE_GUESSED_CHAR_AP;

    let hMax: number;
    let wMax: number;
    const widthBound_h_max = Math.floor(w / aspectRatio);
    const widthBound_w_max = w;

    const heightBound_h_max = h;
    const heightBound_w_max = Math.floor(h * aspectRatio);

    if (widthBound_h_max < h) {
        hMax = widthBound_h_max;
        wMax = widthBound_w_max;
    } else if (heightBound_w_max < w) {
        hMax = heightBound_h_max;
        wMax = heightBound_w_max;
    } else {
        throw Error('YONGLO');
    }

    const pixelsPerChar_H = width / wMax;
    const pixelsPerChar_W = height / hMax;

    const { data, info } = await image
        .raw() // Get raw pixel data
        .toBuffer({ resolveWithObject: true });

    const pixels: color[][] = [];

    for (let i = 0; i < height; i++) {
        const row: color[] = [];
        for (let j = 0; j < width; j++) {
            const pixelIndex = (i * width + j) * channels;
            let r: number, g: number, b: number, a: number;
            if (channels < 3) {
                throw Error('Less than three channel in da image');
            } else {
                r = data[pixelIndex]; // Red
                g = data[pixelIndex + 1]; // Green
                b = data[pixelIndex + 2]; // Blue
            }
            if (channels === 4) {
                a = data[pixelIndex + 3]; // Alpha (transparency)
            }
            const rgb: color = {
                mode: 'rgb',
                r: r / 255,
                g: g / 255,
                b: b / 255,
            }
            row.push(rgb);
        }
        pixels.push(row);
    }

    for (let ih = 0; ih < hMax; ih++) {
        //each row
        let str = '';
        const dataPixelIdxY = Math.floor((height / hMax) * ih);


        for (let iw = 0; iw < wMax; iw++) {
            //each column in row

            const dataPixelIdxX = Math.floor((width / wMax) * iw);
            const color = colorStrategy(dataPixelIdxY, dataPixelIdxX, pixelsPerChar_H, pixelsPerChar_W, pixels);
            const char = colString(block(1), colorToRgb(color));


            str += char;
        }


        strs.push(str);
    }

    return strs;
};


function getPixelFromBuffer(buffer: Buffer, x: Number, y: number, channels = 3) {

}