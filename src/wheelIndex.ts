import { drawHslWheel } from '../VibeCoded/wheelImager.ts';
import { colorToHsl, hsl } from './palleteFuncs.ts';
import { randHsl } from './random.ts';

const copied = `
OD1821
207, 43, 9
344966
215, 32, 30
E6AACE
324, 55, 78
FOF4EF
108, 19, 95
BFCC94
74, 35, 69
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
	filename += `-${parts[0]}`;
	return {
		mode: 'hsl',
		h: parseInt(parts[0]),
		s: parseFloat(parts[1]) / 100,
		l: parseFloat(parts[2]) / 100,
	};
});

filename = 'Wheel' + Date.now();

drawHslWheel(hsls, `output/${filename}.png`);
