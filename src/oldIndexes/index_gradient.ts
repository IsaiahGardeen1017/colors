import { rgb, hsl, formatRgb, formatHsl, formatHex, converter, parse } from 'culori';
import { block, colString, printCol } from '../textfuncs.ts';
import { randHsl, randRgb } from '../random.ts';

const blockSize = 2;
const numDemos = 1;


const { columns, rows } = Deno.consoleSize();
const numBlocks = Math.floor(columns/2);
const rowsPerDemo = Math.floor((rows - 5)/numDemos);

//const rgb1 = parse('#6e423b');
const rgb1 = randHsl();
const hsl1 = converter('hsl')(rgb1);
const hsl2 = {
    ...hsl1,
    h: hsl1.h + 180,
    l: 1 - hsl1.l 
}
const rgb2 = converter('rgb')(hsl2);



console.log(formatHex(rgb1));
console.log(formatHex(rgb2));

console.log(`${formatHex(rgb1)} ${colString(block(5),rgb1)} ==> ${colString(block(5),rgb2)} ${formatHex(rgb2)} `)

for (let i = 0; i < rowsPerDemo; i++) {
    let str = '';
    for (let j = 0; j < numBlocks; j++) {
        const mixer = (v1: number, v2: number):number => {
            // 0,0 vs i,j
            const percent1 = i / rowsPerDemo;
            const percent2 = j / numBlocks;
            const v1Percent = (percent1 + percent2) / 2;
            const v2Percent = 1 - v1Percent;
            
            return v1 * v1Percent + v2 * v2Percent;
        };
        
        const color = {
            r: mixer(rgb1.r, rgb2.r),
            g: mixer(rgb1.g, rgb2.g),
            b: mixer(rgb1.b, rgb2.b),
            mode: 'rgb'
        }
        str += colString(block(blockSize), color);
    }


    console.log(str);
}
