import { rgb, hsl, formatRgb, converter } from 'culori';


export type rgb = { mode?: string, r: number, g: number, b: number }

export function randRgb(): rgb{
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        mode: 'rgb'
    }
}

export function randHsl(): rgb{
    const hslColor = {
        h: Math.random() * 360,
        s: Math.random(),
        l: Math.random(),
        mode: 'hsl'
    }
    return converter('rgb')(hslColor);
}