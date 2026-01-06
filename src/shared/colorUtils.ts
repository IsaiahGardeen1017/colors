import { ColorValue, HslColorValue, HexColorValue, toHex } from './colorTypes';

/**
 * @param {HslColorValue} color - The HSL color value to convert
 * @returns {string} CSS hsl() string representation
 */
export function hslToCss(color: HslColorValue): string {
  return `hsl(${color.h}, ${Math.round(color.s * 100)}%, ${Math.round(color.l * 100)}%)`;
}

/**
 * @param {ColorValue} color - The color value to convert
 * @returns {string} CSS color string representation
 */
export function colorToCss(color: ColorValue): string {
  if (color.type === 'hsl') {
    return hslToCss(color);
  }
  if (color.type === 'rgb') {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  }
  return color.hex;
}

/**
 * @param {HslColorValue} hsl - The HSL color value to clamp
 * @returns {HslColorValue} Clamped HSL color with values within valid ranges
 */
export function clampHsl(hsl: HslColorValue): HslColorValue {
  return {
    h: Math.max(0, Math.min(360, hsl.h)),
    s: Math.max(0, Math.min(1, hsl.s)),
    l: Math.max(0, Math.min(1, hsl.l)),
    type: 'hsl'
  };
}

/**
 * @param {HslColorValue} color - The HSL color value
 * @returns {HexColorValue} The opposite color in hex format
 */
export function getOppositeColor(color: HslColorValue): HexColorValue {
  const newH = (color.h + 180) % 360;
  const newS = 1 - color.s;
  const newL = 1 - color.l;
  
  const oppositeHsl: HslColorValue = {
    h: newH,
    s: newS,
    l: newL,
    type: 'hsl'
  };
  
  return toHex(oppositeHsl);
}

export { toRgb, toHsl, toHex } from './colorTypes';
