//Each value is between 0 and 255
export type RgbColorValue = {
    r: number,
    g: number,
    b: number,
    type: 'rgb'
};

// h is between 0 and 360
// s is between 0 and 1
// l is between 0 and 1
export type HslColorValue = {
    h: number,
    s: number,
    l: number,
    type: 'hsl'
}

// #ffab43 is an example of a hex
export type HexColorValue = {
    hex: string,
    type: 'hex'
}


export type ColorValue = HexColorValue | HslColorValue | RgbColorValue


/**
 * @param {ColorValue} color - The color value to convert
 * @returns {RgbColorValue} The color converted to RGB format
 */
export function toRgb(color: ColorValue): RgbColorValue {
  if (color.type === 'rgb') {
    return color;
  }
  
  if (color.type === 'hsl') {
    const h = color.h / 360;
    const s = color.s;
    const l = color.l;
    
    let r: number, g: number, b: number;
    
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number): number => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
      type: 'rgb'
    };
  }
  
  if (color.type === 'hex') {
    const hex = color.hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return { r, g, b, type: 'rgb' };
  }
  
  throw new Error('Unknown color type');
}

/**
 * @param {ColorValue} color - The color value to convert
 * @returns {HslColorValue} The color converted to HSL format
 */
export function toHsl(color: ColorValue): HslColorValue {
  if (color.type === 'hsl') {
    return color;
  }
  
  if (color.type === 'rgb') {
    const r = color.r / 255;
    const g = color.g / 255;
    const b = color.b / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h: number, s: number;
    const l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
        default:
          h = 0;
      }
    }
    
    return {
      h: h * 360,
      s: s,
      l: l,
      type: 'hsl'
    };
  }
  
  if (color.type === 'hex') {
    return toHsl(toRgb(color));
  }
  
  throw new Error('Unknown color type');
}

/**
 * @param {ColorValue} color - The color value to convert
 * @returns {HexColorValue} The color converted to hex format
 */
export function toHex(color: ColorValue): HexColorValue {
  if (color.type === 'hex') {
    return color;
  }
  
  const rgb = toRgb(color);
  const toHexChar = (c: number): string => {
    const hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return {
    hex: `#${toHexChar(rgb.r)}${toHexChar(rgb.g)}${toHexChar(rgb.b)}`,
    type: 'hex'
  };
}