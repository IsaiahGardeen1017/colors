import { rgb24 } from '@std/fmt/colors';
import { Printer } from './printer.ts';
import { color, colorToRgb, hexText, hslText, Pallette } from './palleteFuncs.ts';

export function block(num?: number): string{
    const amount = num || 1;
    return ''.padEnd(amount, '█');
}


export type rgb = { mode?: string, r: number, g: number, b: number }

export function printCol(text: string, color: rgb){
        console.log(colString(text, color));
}


export function colString(text: string, color: rgb){
    const rgb = {r: color.r * 255, g: color.g * 255, b: color.b * 255};
    return rgb24(text, rgb);
}


export function printColorPalletteBlock(printer: Printer, pallette: Pallette){
    let strs: string[] = [pallette.title];
    pallette.colors.forEach((c) => {
        strs.push(colString(block(10), colorToRgb(c)) + hslText(c));
    });
    printer.printSomething(strs);
};