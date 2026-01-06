import { ColorValue, HslColorValue, toHsl } from './src/shared/colorTypes';
import { toRgb, colorToCss, getOppositeColor, toHex } from './src/shared/colorUtils';

const colorWheel = document.getElementById('colorWheel') as HTMLCanvasElement;
if (!colorWheel) throw new Error('Color wheel canvas not found');
const ctx = colorWheel.getContext('2d')!;
if (!ctx) throw new Error('Could not get 2d context');

const hueSlider = document.getElementById('hueSlider') as HTMLInputElement;
const saturationSlider = document.getElementById('saturationSlider') as HTMLInputElement;
const lightnessSlider = document.getElementById('lightnessSlider') as HTMLInputElement;
const hueValue = document.getElementById('hueValue')!;
const saturationValue = document.getElementById('saturationValue')!;
const lightnessValue = document.getElementById('lightnessValue')!;
const hslValue = document.getElementById('hslValue')!;
const hexValue = document.getElementById('hexValue')!;
const paletteDisplay = document.getElementById('paletteDisplay')!;
const paletteBlocks = document.getElementById('paletteBlocks')!;
const splitsInput = document.getElementById('splitsInput') as HTMLInputElement;
const splitsValue = document.getElementById('splitsValue')!;
const splitsIncrement = document.getElementById('splitsIncrement')!;
const splitsDecrement = document.getElementById('splitsDecrement')!;
const separationSlider = document.getElementById('separationSlider') as HTMLInputElement;
const separationValue = document.getElementById('separationValue')!;

if (!hueSlider || !saturationSlider || !lightnessSlider) {
    throw new Error('Required DOM elements not found');
}

let currentColor: HslColorValue = {
    h: 180,
    s: 0.5,
    l: 0.5,
    type: 'hsl'
};

let additionalColors: ColorValue[] = [];
let hueSlices = 3;
let separation = 20;

function initializeInputs(): void {
    hueSlider.value = currentColor.h.toString();
    saturationSlider.value = (currentColor.s * 100).toString();
    lightnessSlider.value = (currentColor.l * 100).toString();
    splitsInput.value = hueSlices.toString();
    separationSlider.value = separation.toString();
    
    updateSliderValues();
    updateInputDisplays();
}

function updateInputDisplays(): void {
    splitsValue.textContent = hueSlices.toString();
    separationValue.textContent = Math.round(separation).toString();
}

/**
 * @returns {void}
 */
function drawColorWheel(): void {
    const centerX = colorWheel.width / 2;
    const centerY = colorWheel.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, colorWheel.width, colorWheel.height);

    const imageData = ctx.createImageData(colorWheel.width, colorWheel.height);
    const data = imageData.data;

    for (let y = 0; y < colorWheel.height; y++) {
        for (let x = 0; x < colorWheel.width; x++) {
            const dx = x - centerX;
            const dy = y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= radius) {
                let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
                if (angle < 0) angle += 360;

                const s = distance / radius;
                const l = currentColor.l;

                const pixelHsl: HslColorValue = {
                    h: angle,
                    s: s,
                    l: l,
                    type: 'hsl'
                };

                const rgb = toRgb(pixelHsl);

                const index = (y * colorWheel.width + x) * 4;
                data[index] = rgb.r;
                data[index + 1] = rgb.g;
                data[index + 2] = rgb.b;
                data[index + 3] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);

    const indicatorRadius = currentColor.s * radius;
    const indicatorX = centerX + indicatorRadius * Math.cos((currentColor.h - 90) * Math.PI / 180);
    const indicatorY = centerY + indicatorRadius * Math.sin((currentColor.h - 90) * Math.PI / 180);

    //White circle on selected color
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.stroke();

    //Black circle on selected color
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, 2 * Math.PI);
    ctx.stroke();

    additionalColors.forEach((col) => {
        const color = toHsl(col);
        const cradius = color.s * radius;
        const cx = centerX + cradius * Math.cos((color.h - 90) * Math.PI / 180);
        const cy = centerY + cradius * Math.sin((color.h - 90) * Math.PI / 180);

        //White circle on selected color
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, 2 * Math.PI);
        ctx.stroke();
    });

}

/**
 * @returns {void}
 */
function updateColor(): void {
    const hslCss = colorToCss(currentColor);
    const hexColor = toHex(currentColor);
    const oppositeColor = getOppositeColor(currentColor);



    hslValue.textContent = hslCss;
    hexValue.textContent = hexColor.hex;

    additionalColors = getAllColors(hueSlices, separation);
    updatePaletteBlocks();

    drawColorWheel();
}


/**
 * @param {number} hue_slices - Number of colors to generate
 * @param {number} separation - Separation value (1-180)
 * @returns {ColorValue[]} Array of color values
 */
function getAllColors(hue_slices: number, separation: number): ColorValue[] {
    if (hue_slices <= 0) return [];
    
    const degreesPer = 360 / hue_slices;
    const hues = [];

    console.log('splits', hue_slices);

    let numOffsetsPerSide;
    if(hue_slices % 2 !== 0){
        //Odd, we will have a complimentary
        hues.push(currentColor.h + 180);
        numOffsetsPerSide = (hue_slices - 1) / 2;
        console.log('num IN', numOffsetsPerSide);
    }else{
        numOffsetsPerSide = hue_slices / 2;
        console.log('num OUT', numOffsetsPerSide);
    }



    for (let i = 0; i < numOffsetsPerSide; i++) {
        const a = normalizeAngle(currentColor.h + (separation * (i + 1)));
        const b = normalizeAngle(currentColor.h - (separation * (i + 1)));
        console.log(currentColor.h, a, b);
        hues.push(a);
        hues.unshift(b);
    }

    return hues.map((hue) => {
        return {
            ...currentColor,
            h: hue,
        }
    });
}

function normalizeAngle(angle: number): number{
    if(angle < 0){
        return normalizeAngle(angle + 360);
    }else{
        return angle % 360;
    }
}


/**
 * @returns {void}
 */
function updatePaletteBlocks(): void {
    paletteBlocks.innerHTML = '';

    const allColors = [currentColor, ...additionalColors];
    
    allColors.forEach((color) => {
        const block = document.createElement('div');
        block.className = 'palette-block';
        block.style.backgroundColor = colorToCss(color);
        paletteBlocks.appendChild(block);
    });
}


/**
 * @returns {void}
 */
function updateSliderValues(): void {
    hueValue.textContent = Math.round(currentColor.h).toString();
    saturationValue.textContent = Math.round(currentColor.s * 100).toString();
    lightnessValue.textContent = Math.round(currentColor.l * 100).toString();
}

hueSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    currentColor = {
        ...currentColor,
        h: parseFloat(target.value)
    };
    updateSliderValues();
    updateColor();
});

saturationSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    currentColor = {
        ...currentColor,
        s: parseFloat(target.value) / 100
    };
    updateSliderValues();
    updateColor();
});

lightnessSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    currentColor = {
        ...currentColor,
        l: parseFloat(target.value) / 100
    };
    updateSliderValues();
    updateColor();
});

colorWheel.addEventListener('click', (e: MouseEvent) => {
    const rect = colorWheel.getBoundingClientRect();
    const x = e.clientX - rect.left - colorWheel.width / 2;
    const y = e.clientY - rect.top - colorWheel.height / 2;

    const distance = Math.sqrt(x * x + y * y);
    const radius = Math.min(colorWheel.width, colorWheel.height) / 2 - 10;

    if (distance <= radius) {
        let angle = Math.atan2(y, x) * 180 / Math.PI + 90;
        if (angle < 0) angle += 360;

        const s = Math.min(1, distance / radius);

        currentColor = {
            ...currentColor,
            h: angle,
            s: s
        };

        hueSlider.value = currentColor.h.toString();
        saturationSlider.value = (currentColor.s * 100).toString();

        updateSliderValues();
        updateColor();
    }
});

splitsInput.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = parseInt(target.value) || 0;
    hueSlices = Math.max(0, value);
    splitsInput.value = hueSlices.toString();
    splitsValue.textContent = hueSlices.toString();
    updateColor();
});

splitsIncrement.addEventListener('click', () => {
    hueSlices++;
    splitsInput.value = hueSlices.toString();
    splitsValue.textContent = hueSlices.toString();
    updateColor();
});

splitsDecrement.addEventListener('click', () => {
    if (hueSlices > 0) {
        hueSlices--;
        splitsInput.value = hueSlices.toString();
        splitsValue.textContent = hueSlices.toString();
        updateColor();
    }
});

separationSlider.addEventListener('input', (e: Event) => {
    const target = e.target as HTMLInputElement;
    separation = parseFloat(target.value);
    updateInputDisplays();
    updateColor();
});

initializeInputs();
updateColor();

