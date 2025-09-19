export class Printer {

    chamber: string[];

    constructor() {
        this.chamber = [''];
    };

    get lineWidth(): number {
        return printableLength(this.chamber.reduce((prev: string, current: string) => {
            return printableLength(prev) >= printableLength(current) ? prev : current;
        }));
    }

    get lineHeight(): number {
        return this.chamber.length;
    }

    printSomething(text: string | string[], spaced = true, lineH = 1) {
        const { columns, rows } = getConsoleSize();

        const padWidth = this.lineWidth;
        for (let i = 0; i < this.lineHeight; i++) {
            this.chamber[i] = padEnd(this.chamber[i], padWidth, ' ');
        }

        const texts = Array.isArray(text) ? text : [text];

        //Change line height and add empty rows if needed
        const actualLineHight = Math.max(texts.length, this.lineHeight, lineH);
        const targetLineWidth = this.lineWidth;
        if (actualLineHight > this.lineHeight) {
            for (let i = this.lineHeight; i < actualLineHight; i++) {
                this.chamber.push(''.padEnd(targetLineWidth, ' '));
            }
        }

        //Determine width of new text
        let widthOfAddedText = printableLength(texts.reduce((prev: string, current: string) => {
            return printableLength(prev) >= printableLength(current) ? prev : current;
        })) + (spaced ? 1 : 0);

        // If we need to wrap, print previous
        if (widthOfAddedText + this.lineWidth > columns) {
            this.actuallyPrint();
            widthOfAddedText--;
            for(let i = 0; i < Math.max(texts.length, lineH); i++){
                this.chamber.push('');
            }
        }

        

        // Load the chamber
        for (let i = 0; i < this.lineHeight; i++) {
            const textToAdd = (spaced ? ' ' : '') + (texts[i] ? texts[i] : '');
            this.chamber[i] = this.chamber[i] + textToAdd;
        }


    }

    protected actuallyPrint() {
        for (let i = 0; i < this.chamber.length; i++) {
            console.log(this.chamber[i]);
        }
        this.chamber = [];
    }

    newLine(){
        this.actuallyPrint();
    }

    finished() {
        this.actuallyPrint();
    }
}


function getConsoleSize(): { columns: number, rows: number } {
    const { columns, rows } = Deno.consoleSize();
    return { columns, rows }
}



function printableLength(str: string): number {
    // Regular expression to match ANSI escape codes
    // This is a common regex for stripping ANSI codes
    const ansiRegex =
        /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    return str.replace(ansiRegex, "").length;
}


function padEnd(str: string, len: number, char = ' '){
    const c = char[0] ?? ' ';
    const l = printableLength(str);
    const e = ''.padEnd(len - l, c);
    return str + e;
}