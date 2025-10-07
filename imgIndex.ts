import { Printer } from './src/printer.ts';
import { averageAll, quantizeOnHSLFuncBuilder,  renderImage, sampleFirst } from './src/renderImage.ts';
import { block, colString } from './src/textfuncs.ts';


let img;
img = Deno.readFileSync("./input/coast.jpeg");
img = Deno.readFileSync("./input/square.png");

const { columns, rows } = Deno.consoleSize();

const printer = new Printer();

const imgRows = Math.floor(rows/2 - 4);
const imgCols = Math.floor(columns -2);

const sampleFirstResult = ['','First Pixel'].concat(await renderImage(img, imgRows, imgCols, sampleFirst));
printer.printSomething(sampleFirstResult);

const averageAllResult = ['','Average Color'].concat(await renderImage(img, imgRows, imgCols, averageAll));
printer.printSomething(averageAllResult);

const quantized1 = ['','Quantize 15 First'].concat(await renderImage(img, imgRows, imgCols, quantizeOnHSLFuncBuilder(75, 20, 20, 'first')));
printer.printSomething(quantized1);

const quantized2 = ['','Quantize 15 First'].concat(await renderImage(img, imgRows, imgCols, quantizeOnHSLFuncBuilder(75, 20, 20, 'average')));
printer.printSomething(quantized2);




printer.finished();

