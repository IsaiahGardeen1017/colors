
import sharp from 'sharp';
import { rgb24 } from '@std/fmt/colors';
import { block, colString } from './textfuncs.ts';
import { black } from '@std/fmt/colors';
import { color, colorToHsl, colorToRgb, rgbToHsl } from './palleteFuncs.ts';
import { randHsl } from './random.ts';
import { Buffer } from "node:buffer";

export type ColorStrategy = (y0: number, x0: number, xSize: number, ysize: number, imageWidth: number, pixels: Buffer, channels: number) => color;


export function averageAll(y0: number, x0: number, xSize: number, ysize: number, imageWidth: number, pixels: Buffer, channels: number): color {
    let rAvg = 0;
    let gAvg = 0;
    let bAvg = 0;
    let tot = 0;

    for (let i = 0; i < ysize; i++) {
        let pixelIndexStart = (((y0 + i) * imageWidth) + x0) * channels;
        let pixelIndexEnd = (((y0 + i) * imageWidth) + (x0 + xSize)) * channels;
        for (let j = pixelIndexStart; j < pixelIndexEnd; j += channels) {
            let r, g, b, a;
            if (channels < 3) {
                throw Error('Less than three channel in da image');
            } else {
                r = pixels[j]; // Red
                g = pixels[j + 1]; // Green
                b = pixels[j + 2]; // Blue
            }
            if (channels === 4) {
                a = pixels[j + 3]; // Alpha (transparency)
            }
            tot++;
            rAvg += r;
            gAvg += g;
            bAvg += b;
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

export function sampleFirst(y0: number, x0: number, xSize: number, ysize: number, imageWidth: number, pixels: Buffer, channels: number): color {

    const pixelIndex = (y0 * imageWidth + x0) * channels;
    let r, g, b, a;
    if (channels < 3) {
        throw Error('Less than three channel in da image');
    } else {
        r = pixels[pixelIndex]; // Red
        g = pixels[pixelIndex + 1]; // Green
        b = pixels[pixelIndex + 2]; // Blue
    }
    if (channels === 4) {
        a = pixels[pixelIndex + 3]; // Alpha (transparency)
    }

    const rgb: color = {
        mode: 'rgb',
        r: r / 255,
        g: g / 255,
        b: b / 255,
    }


    return rgb;
}


export function getListOfValidColors(pixels:Buffer, channels: number): color[]{
    return [];
}

export function quantizeOnHSLFuncBuilder(hueSlices: number, satSlices: number, litSlices: number, sampleMode: 'average' | 'first'): ColorStrategy {
    return (y0: number, x0: number, xSize: number, ysize: number, imageWidth: number, pixels: Buffer, channels: number) => {
        
        let avgRGB: color = randHsl();
        if(sampleMode === 'average'){
            avgRGB = averageAll(y0, x0, xSize, ysize, imageWidth, pixels, channels);
        }else if(sampleMode === 'first'){
            avgRGB = sampleFirst(y0, x0, xSize, ysize, imageWidth, pixels, channels);
        }

        let hsl = colorToHsl(avgRGB);

        const hSliceWidth = 360 / hueSlices;
        const newH = Math.floor(hsl.h / hSliceWidth) * hSliceWidth;
        
        let newS;
        if(satSlices === 0){
            newS = 0.5;
        }else{
            const sSliceWidth = 1.0 / satSlices;
            newS = Math.floor(hsl.s / sSliceWidth) * sSliceWidth;
        }
        
        let newL;
        if(litSlices === 0){
            newL = 0.5;
        }else{
            const lSliceWidth = 1.0 / litSlices;
            newL = Math.floor(hsl.l / lSliceWidth) * lSliceWidth;

        }
        
        
        
        return {
            mode: 'hsl',
            h: newH,
            s: newS,
            l: newL
        }
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

    for (let ih = 0; ih < hMax; ih++) {
        //each row
        let str = '';
        const dataPixelIdxY = Math.floor((height / hMax) * ih);
        for (let iw = 0; iw < wMax; iw++) {
            //each column in row

            const dataPixelIdxX = Math.floor((width / wMax) * iw);
            const color = colorStrategy(dataPixelIdxY, dataPixelIdxX, pixelsPerChar_H, pixelsPerChar_W, width, data, channels);
            const char = colString(block(1), colorToRgb(color));


            str += char;
        }
        strs.push(str);
    }

    return strs;
};


function getPixelFromBuffer(buffer: Buffer, x: Number, y: number, channels = 3){

}