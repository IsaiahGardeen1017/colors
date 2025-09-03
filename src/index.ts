import { rgb, hsl, formatRgb, converter } from 'culori';
import { block, colString, printCol } from './textfuncs.ts';
import { randHsl, randRgb } from './random.ts';

const blockSize = 2;
const numDemos = 1;


const { columns, rows } = Deno.consoleSize();
const numBlocks = Math.floor(columns/2);
const rowsPerDemo = Math.floor((rows - 5)/numDemos);


console.log('Hsl');
for (let i = 0; i < rowsPerDemo; i++) {
    let str = '';
    for (let j = 0; j < numBlocks; j++) {
        const l = i/rowsPerDemo;
        const s = j/numBlocks;
        const hslColor = {
            h: Math.random() * 360,
            s: s,
            l: l,
            mode: 'hsl'
        }
        const randCol = converter('rgb')(hslColor);
        str += colString(block(blockSize), randCol);
    }
    console.log(str);
}
