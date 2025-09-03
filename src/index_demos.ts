import { rgb, hsl, formatRgb, converter } from 'culori';
import { block, colString, printCol } from './textfuncs.ts';
import { randHsl, randRgb } from './random.ts';

const blockSize = 2;
const numDemos = 5;


const { columns, rows } = Deno.consoleSize();
const numBlocks = Math.floor(columns/2);
const colsPerDemo = Math.floor((rows - 5)/numDemos);

console.log('Hsl');
for (let i = 0; i < colsPerDemo; i++) {
    let hslRandStr = '';
    for (let i = 0; i < numBlocks; i++) {
        const randCol = randHsl();
        hslRandStr += colString(block(blockSize), randCol);
    }
    console.log(hslRandStr);
}

console.log('Hsl (high s)');
for (let i = 0; i < colsPerDemo; i++) {
    let hslRandStr = '';
    for (let i = 0; i < numBlocks; i++) {
        const hslColor = {
            h: Math.random() * 360,
            s: (Math.random() * 0.25) + 0.75,
            l: Math.random(),
            mode: 'hsl'
        }
        const randCol = converter('rgb')(hslColor);
        hslRandStr += colString(block(blockSize), randCol);
    }
    console.log(hslRandStr);
}


console.log(`Hsl (low s)`);
for (let i = 0; i < colsPerDemo; i++) {
    let hslRandStr = '';
    for (let i = 0; i < numBlocks; i++) {
        const hslColor = {
            h: Math.random() * 360,
            s: (Math.random() * 0.25),
            l: Math.random(),
            mode: 'hsl'
        }
        const randCol = converter('rgb')(hslColor);
        hslRandStr += colString(block(blockSize), randCol);
    }
    console.log(hslRandStr);
}

console.log('Hsl (high l)');
for (let i = 0; i < colsPerDemo; i++) {
    let hslRandStr = '';
    for (let i = 0; i < numBlocks; i++) {
        const hslColor = {
            h: Math.random() * 360,
            s: Math.random(),
            l: (Math.random() * 0.25) + 0.75,
            mode: 'hsl'
        }
        const randCol = converter('rgb')(hslColor);
        hslRandStr += colString(block(blockSize), randCol);
    }
    console.log(hslRandStr);
}


console.log(`Hsl (low l)`);
for (let i = 0; i < colsPerDemo; i++) {
    let hslRandStr = '';
    for (let i = 0; i < numBlocks; i++) {
        const hslColor = {
            h: Math.random() * 360,
            s: Math.random(),
            l: (Math.random() * 0.25),
            mode: 'hsl'
        }
        const randCol = converter('rgb')(hslColor);
        hslRandStr += colString(block(blockSize), randCol);
    }
    console.log(hslRandStr);
}





/**

const toHsl = converter('hsl');
const toRgb = converter('rgb');

const rgbColor = rgb('tomato');

const hslColor = toHsl(rgbColor);

console.log(hslColor);

const finalColor = toRgb(hslColor);

printCol(block(25), finalColor);


//*/