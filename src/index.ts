import { randHsl, randHslOptions, randRgb } from './random.ts';
import { Printer } from './printer.ts';
import { color, palletteBuilder, ToneStrategies } from './palleteFuncs.ts';
import { printColorPalletteBlock } from './textfuncs.ts';
import { rgb } from 'culori';

const numDemos = 1;

const printer = new Printer();

const { columns, rows } = Deno.consoleSize();
const numBlocks = Math.floor(columns / 2);
const rowsPerDemo = Math.floor((rows - 5) / numDemos);

const opts: randHslOptions = {
	sMin: 0.5,
	sMax: 0.8,
	lMax: 0.8,
	lMin: 0.2,
};

const numColors = 4;

const palletetParent = randHsl(opts);
//const palletetParent = rgb('bf9818');

const colorFunc = (): color => {
	//return randHsl(opts);
	//return rgb('8cb369');
	return randHsl(opts);
};

let toner: ToneStrategies = 'bold';
for (let i = 0; i < 3; i++) {
	printColorPalletteBlock(printer, palletteBuilder(3, 'Triadic', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(2, 'Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Analogous', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Analo-Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Split', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Square', 'expand', toner, colorFunc()));
}

toner = 'flat';
for (let i = 0; i < 3; i++) {
	printColorPalletteBlock(printer, palletteBuilder(3, 'Triadic', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(2, 'Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Analogous', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Analo-Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Split', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Square', 'expand', toner, colorFunc()));
}

toner = 'muted';
for (let i = 0; i < 3; i++) {
	printColorPalletteBlock(printer, palletteBuilder(3, 'Triadic', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(2, 'Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Analogous', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Analo-Complimentary', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(3, 'Split', 'expand', toner, colorFunc()));
	printColorPalletteBlock(printer, palletteBuilder(4, 'Square', 'expand', toner, colorFunc()));
}

/**
for (let i = 0; i < pallettes.length; i++) {

    const pallette = pallettes[i];

    const blockSize = Math.floor(columns / pallette.length) - 1;

    let str = '';
    for (let j = 0; j < pallette.length; j++) {
        const color = colorToRgb(pallette[j]);
        str += colString(block(blockSize), color);
    }

    for (let k = 0; k < (rows / pallettes.length) - 5; k++) {
        console.log(str);
    }
    console.log('');


}
*/

printer.finished();
