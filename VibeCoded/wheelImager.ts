// hsl_wheel.ts
import { createCanvas } from "jsr:@gfx/canvas";

export interface HSLColor {
  mode: "hsl";
  h: number; // 0–360
  s: number; // 0–1
  l: number; // 0–1
}

function hslToRgb(hDeg: number, s: number, l: number): [number, number, number] {
  const h = ((hDeg % 360) + 360) % 360 / 360;
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [hue2rgb(p, q, h + 1 / 3), hue2rgb(p, q, h), hue2rgb(p, q, h - 1 / 3)];
}

export async function drawHslWheel(
  colors: HSLColor[],
  filename = "hsl_wheel.png",
  size = 600,
) {
  const swatchHeight = Math.max(50, size / 6);
  const totalHeight = size + swatchHeight;

  const canvas = createCanvas(size, totalHeight);
  const ctx = canvas.getContext("2d");

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;

  // --- Draw wheel background ---
  const img = ctx.createImageData(size, size);
  const data = img.data;
  for (let y = 0; y < size; y++) {
    const dy = y - cy;
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const idx = (y * size + x) * 4;
      const dist = Math.hypot(dx, dy);

      if (dist > radius) {
        data[idx + 3] = 0;
        continue;
      }

      const angleRad = Math.atan2(dy, dx);
      const hue = ((angleRad * 180) / Math.PI + 360) % 360;
      const sat = dist / radius;
      const light = 0.5;

      const [r, g, b] = hslToRgb(hue, sat, light);
      data[idx] = Math.round(r * 255);
      data[idx + 1] = Math.round(g * 255);
      data[idx + 2] = Math.round(b * 255);
      data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  // --- Draw markers ---
  const baseMarkerRadius = Math.max(12, size / 60);
  const markerRadius = baseMarkerRadius * 0.75; // ¾ size
  const strokeWidth = Math.max(2, size / 300);

  for (const col of colors) {
    if (col.mode !== "hsl") continue;
    const h = col.h;
    const s = Math.max(0, Math.min(1, col.s));
    const l = Math.max(0, Math.min(1, col.l));

    const angle = ((h % 360) / 360) * Math.PI * 2;
    const rpos = s * radius;
    const mx = cx + Math.cos(angle) * rpos;
    const my = cy + Math.sin(angle) * rpos;

    ctx.beginPath();
    ctx.arc(mx, my, markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
    ctx.fill();

    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = "black";
    ctx.stroke();
  }

  // --- Draw swatch strip ---
  if (colors.length > 0) {
    const swatchWidth = size / colors.length;
    for (let i = 0; i < colors.length; i++) {
      const col = colors[i];
      if (col.mode !== "hsl") continue;
      const { h, s, l } = col;
      const x = i * swatchWidth;
      const y = size;
      ctx.fillStyle = `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
      ctx.fillRect(x, y, swatchWidth, swatchHeight);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "black";
      ctx.strokeRect(x, y, swatchWidth, swatchHeight);
    }
  }

  const png = canvas.encode("png");
  await Deno.writeFile(filename, png);
  console.log(`Saved ${filename}`);
}

// Example direct run
if (import.meta.main) {
  const example: HSLColor[] = [
    { mode: "hsl", h: 100, s: 0.5, l: 0.5 },
    { mode: "hsl", h: 220, s: 0.75, l: 0.4 },
    { mode: "hsl", h: 300, s: 0.25, l: 0.75 },
    { mode: "hsl", h: 45, s: 0.8, l: 0.6 },
    { mode: "hsl", h: 10, s: 0.9, l: 0.5 },
  ];
  await drawHslWheel(example, "wheel_with_swatches.png", 600);
}
