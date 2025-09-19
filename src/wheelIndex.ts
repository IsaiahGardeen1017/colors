import { drawHslWheel } from '../VibeCoded/wheelImager.ts';
import { colorToHsl, hsl } from './palleteFuncs.ts';
import { randHsl } from './random.ts';

const copied = `

8CB369
92, 33, 56
F4E285
50, 83, 74
F4A259
28, 88, 65
5B8E7D
160, 22, 46
BC4B51
357, 46, 52

`;

const lines = copied.split('\n');
const hslsLines = lines.filter((str) => {
    return str.includes(',');
});

let filename = 'Pallette';

const hsls: hsl[] = hslsLines.map((l) => {
    console.log(l);
    const parts = l.split(', ');
    console.log(parts);
    filename += `-${parts[0]}`
    return {
        mode: 'hsl',
        h: parseInt(parts[0]),
        s: parseFloat('.' + parts[1]),
        l: parseFloat('.' + parts[2]),
    }
})



drawHslWheel(hsls, `output/${filename}.png`)