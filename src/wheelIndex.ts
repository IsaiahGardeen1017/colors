import { drawHslWheel } from '../VibeCoded/wheelImager.ts';
import { colorToHsl, hsl } from './palleteFuncs.ts';
import { randHsl } from './random.ts';

const copied = `

320A28
315, 67, 12
511730
334, 56, 20
8E443D
5, 40, 40
CB9173
20, 46, 62
EOD68A
53, 58, 71

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

filename = 'Wheel'

drawHslWheel(hsls, `output/${filename}.png`)