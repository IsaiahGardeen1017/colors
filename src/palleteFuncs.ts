import { formatRgb, formatHsl, formatHex, converter, parse } from 'culori';
import { shuffle } from './random.ts';
import { Printer } from './printer.ts';

export type rgb = { mode: 'rgb', r: number, g: number, b: number }
export type hsl = { mode: 'hsl', h: number, s: number, l: number }
export type color = rgb | hsl;


export function rgbToHsl(rgb: rgb): hsl {
    return converter('hsl')(rgb);
}

export function hslToRgb(hsl: hsl): rgb {
    return converter('rgb')(hsl);
}

export function colorToRgb(col: color): rgb {
    switch (col.mode) {
        case 'hsl':
            return hslToRgb(col);
        case 'rgb':
            return col;
    }
}

export function colorToHsl(col: color): hsl {
    switch (col.mode) {
        case 'hsl':
            return col;
        case 'rgb':
            return rgbToHsl(col);
    }
}

export function hslText(col: color): string {
    const fixedAmount = 2;
    const hsl = colorToHsl(col);
    return `hsl(${hsl.h.toFixed(fixedAmount)}, ${hsl.s.toFixed(fixedAmount)}, ${hsl.l.toFixed(fixedAmount)})`
}

export function rgbText(col: color): string {
    const rgb = colorToRgb(col);
    return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

export function hexText(col: color): string {
    return formatHex(colorToRgb(col));
}



export type Pallette = {
    title: string,
    colors: color[]
}

export type HueStrategies = 'Monochrome' | 'Complimentary' | 'Triadic' | 'Square' | 'Analogous' | 'Split' | 'Analo-Complimentary';
export type ShadeStrategies = 'expand' | 'shakyExpand' | 'smartMap';
export type ToneStrategies = 'muted' | 'bold' | 'flat';

export function palletteBuilder(totalOut: number, hue: HueStrategies, shader: ShadeStrategies, toner: ToneStrategies, col: color): Pallette {
    let hueStrat: BaseHueStrategy;
    let shadeStrat: ShadeStrategy;
    let toneStrat: ToneStrategy;


    switch (hue) {
        case 'Monochrome':
            hueStrat = monochrome;
            break;
        case 'Triadic':
            hueStrat = triadic;
            break;
        case 'Complimentary':
            hueStrat = complimentary;
            break;
        case 'Square':
            hueStrat = square;
            break;
        case 'Split':
            hueStrat = split;
            break;
        case 'Analogous':
            hueStrat = analogous;
            break;
        case 'Analo-Complimentary':
            hueStrat = analComp;
            break;
    }

    switch (shader) {
        case 'expand':
            shadeStrat = basicExpand;
            break;
        case 'shakyExpand':
            shadeStrat = shakyExpand;
            break;
        default:
            shadeStrat = basicExpand;
    }

    switch (toner) {
        case 'muted':
            toneStrat = muted;
            break;
        case 'bold':
            toneStrat = bold;
            break;
        case 'flat':
            toneStrat = flat;
    }


    return {
        colors: buildPallette(col, totalOut, hueStrat, shadeStrat, toneStrat),
        title: `${totalOut} ${hue} ${toner} ${shader}`
    }
}







export function buildPallette(color: color, n: number, huesStrategy: BaseHueStrategy, shadeStrategy: ShadeStrategy, toneStrategy: ToneStrategy): color[] {
    const hues = huesStrategy(color);

    const initHsl = colorToHsl(color);

    const hsls: hsl[] = hues.map((hue) => {
        return {
            mode: 'hsl',
            h: hue,
            s: initHsl.s,
            l: initHsl.l
        }
    })

    const tones: color[] = toneStrategy(hsls);
    const shades: color[] = shadeStrategy(tones, n);

    return shades;
}


export type ToneStrategy = (colors: color[]) => color[];

const flat: ToneStrategy = (colors: color[]): color[] => {

    const outCols: color[] = [];
    let step = .1;
    let incr = 0;
    colors.forEach((col) => {
        const hslCol = colorToHsl(col);
        outCols.push({
            mode: 'hsl',
            h: hslCol.h,
            s: hslCol.s,
            l: hslCol.l
        });
        incr++;
    });
    return outCols;
};

const muted: ToneStrategy = (colors: color[]): color[] => {

    const outCols: color[] = [];
    let step = .1;
    let incr = 0;
    colors.forEach((col) => {
        const hslCol = colorToHsl(col);
        outCols.push({
            mode: 'hsl',
            h: hslCol.h,
            s: (hslCol.s * .75) - (incr * step),
            l: hslCol.l
        });
        incr++;
    });
    return outCols;
};

const bold: ToneStrategy = (colors: color[]): color[] => {
    const outCols: color[] = [];
    let step = .1;
    let incr = 0;
    colors.forEach((col) => {
        const hslCol = colorToHsl(col);
        outCols.push({
            mode: 'hsl',
            h: hslCol.h,
            s: (hslCol.s) + (incr * step),
            l: hslCol.l
        });
        incr++;
    });
    return outCols;
};



export type ShadeStrategy = (colors: color[], totalOut?: number) => color[];

const smartMap: ShadeStrategy = (colors: color[], totalOut?: number): color[] => {
    const final: color[] = [];
    
    
    return final;
}


const basicExpand: ShadeStrategy = (colors: color[], totalOut = 5): color[] => {
    const cols: color[] = [];

    const splitCounts: number[] = [];
    colors.forEach((h) => { splitCounts.push(0) });

    for (let i = 0; i < totalOut; i++) {
        const colorIndex = i % colors.length;
        splitCounts[colorIndex]++;
    }

    splitCounts.forEach((num, colorIndex) => {
        const chsl = colorToHsl(colors[colorIndex])
        const lSteps = valueUpDownExpander(chsl.l, splitCounts[colorIndex], 0.2);
        lSteps.forEach((l) => {
            cols.push({
                mode: 'hsl',
                h: chsl.h,
                s: chsl.s,
                l: l
            });
        });

    });

    return cols;
}

const shakyExpand: ShadeStrategy = (colors: color[], totalOut = 5): color[] => {
    const cols: color[] = [];

    const splitCounts: number[] = [];
    colors.forEach((h) => { splitCounts.push(0) });

    for (let i = 0; i < totalOut; i++) {
        const colorIndex = i % colors.length;
        splitCounts[colorIndex]++;
    }

    splitCounts.forEach((num, colorIndex) => {
        const chsl = colorToHsl(colors[colorIndex])
        const lSteps = valueUpDownExpander(chsl.s, splitCounts[colorIndex], 0.3).filter((v, idx) => {
            if (idx !== 0) {
                return Math.random() > .5;
            } else {
                return true;
            }
        });
        lSteps.forEach((l) => {
            cols.push({
                mode: 'hsl',
                h: chsl.h,
                s: chsl.s,
                l: l
            });
        });

    });

    return cols;
}


export type BaseHueStrategy = (color: color) => number[];

//Hue Strategies
function complimentary(color: color): number[] {
    return splat(color, 2, 2);
}
function triadic(color: color): number[] {
    return splat(color, 3, 3);
}
function square(color: color): number[] {
    return splat(color, 4, 4);
}
function monochrome(color: color): number[] {
    return [colorToHsl(color).h];
}
function analogous(color: color): number[] {
    const rFunc = (n: number) => { return n - (Math.floor(n / 360) * 360); }
    const hsl = colorToHsl(color);
    return [hsl.h, rFunc(hsl.h + 30), rFunc(hsl.h - 30)];
}
function split(color: color): number[] {
    const rFunc = (n: number) => { return n - (Math.floor(n / 360) * 360); }
    const hsl = colorToHsl(color);
    return [hsl.h, rFunc(hsl.h + 150), rFunc(hsl.h + 200)];
}
function analComp(color: color): number[] {
    const rFunc = (n: number) => { return n - (Math.floor(n / 360) * 360); }
    const hsl = colorToHsl(color);
    return [hsl.h, rFunc(hsl.h + 30), rFunc(hsl.h - 30), rFunc(hsl.h + 180)];
}






function splat(color: color, n: number, numUnique?: number): number[] {
    n = Math.floor(n);
    numUnique = Math.floor(numUnique ?? n);

    const initialHsl = colorToHsl(color);


    const retArray: number[] = [];

    const rFunc = (n: number) => { return n - (Math.floor(n / 360) * 360); }

    const hDistance = 360 / numUnique;
    for (let i = 0; i < n; i++) {
        const h = rFunc(Math.floor(initialHsl.h + (i * hDistance)));
        retArray.push(h);
    }
    return retArray;
}

export function steps(value: number, n: number): number[] {
    const bucketSize = 1 / n;
    let retArr: number[] = [];
    for (let i = 0; i < n; i++) {
        const bucketStandard = bucketSize * i;
        const num = (bucketStandard + value) % 1;
        retArr.push(num);
    }
    return retArr;
}

export function valueUpDownExpander(value: number, n: number, increment: number): number[] {
    const saturations: number[] = [];

    //value === 0.25 && i === 1

    for (let i = 0; i < n; i++) {
        let incrementMultiplier;
        if (i === 0) {
            incrementMultiplier = 0;
        } else if (value < .50) {
            if (i % 2 == 0) {//even started low
                incrementMultiplier = -1 * Math.floor(i / 2);
            } else {//odd  started low
                incrementMultiplier = 1 * Math.ceil(i / 2);
            }
        } else {
            if (i % 2 == 0) {//even started high
                incrementMultiplier = 1 * Math.floor(i / 2);
            } else {//odd started high
                incrementMultiplier = -1 * Math.ceil(i / 2);
            }
        }
        saturations.push(value + (incrementMultiplier * increment));

    }

    return saturations;
}