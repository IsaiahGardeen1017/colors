import { rgb, hsl, formatRgb, converter } from 'culori';


export function randRgb(): rgb {
    return {
        r: Math.random(),
        g: Math.random(),
        b: Math.random(),
        mode: 'rgb'
    }
}


export type randHslOptions = {
    sMin?: number;
    sMax?: number;
    lMin?: number;
    lMax?: number;
    h?: number;
}

export function randHsl(opts?: randHslOptions): rgb {
    const hslColor = {
        h: opts?.h ?? Math.random() * 360,
        s: randBetween(opts?.sMin ?? 0, opts?.sMax ?? 1),
        l: randBetween(opts?.lMin ?? 0, opts?.lMax ?? 1),
        mode: 'hsl'
    }
    return converter('rgb')(hslColor);
}


function randBetween(low: number, high: number): number {
    return Math.random() * (high - low) + low;
}

export function shuffle<T>(arr: T[]): T[]{
  const shuffledArr = [...arr];
  let currentIndex = shuffledArr.length;
  let randomIndex: number;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [shuffledArr[currentIndex], shuffledArr[randomIndex]] = [
      shuffledArr[randomIndex],
      shuffledArr[currentIndex],
    ];
  }

  return shuffledArr;
}