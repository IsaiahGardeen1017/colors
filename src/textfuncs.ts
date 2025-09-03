import { rgb24 } from '@std/fmt/colors';

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