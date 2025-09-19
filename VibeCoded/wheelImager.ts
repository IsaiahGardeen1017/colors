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
  const stripHeight = Math.max(40, size / 10);
  const canvas = createCanvas(size, size + stripHeight);
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
  const markerRadius = baseMarkerRadius * 0.75;
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

  // --- Draw ticks inside wheel ---
  const tickLen = Math.max(16, size / 25); // twice as long
  const tickWidth = Math.max(6, size / 100); // twice as thick

  for (const col of colors) {
    if (col.mode !== "hsl") continue;
    const h = col.h;
    const s = Math.max(0, Math.min(1, col.s));
    const l = Math.max(0, Math.min(1, col.l));

    const angle = ((h % 360) / 360) * Math.PI * 2;
    const xOuter = cx + Math.cos(angle) * radius;
    const yOuter = cy + Math.sin(angle) * radius;
    const xInner = cx + Math.cos(angle) * (radius - tickLen);
    const yInner = cy + Math.sin(angle) * (radius - tickLen);

    // black outline
    ctx.beginPath();
    ctx.moveTo(xInner, yInner);
    ctx.lineTo(xOuter, yOuter);
    ctx.strokeStyle = "black";
    ctx.lineWidth = tickWidth + 2;
    ctx.stroke();

    // colored tick on top
    ctx.beginPath();
    ctx.moveTo(xInner, yInner);
    ctx.lineTo(xOuter, yOuter);
    ctx.strokeStyle = `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
    ctx.lineWidth = tickWidth;
    ctx.stroke();
  }

  // --- Draw color strip ---
  const rectWidth = size / colors.length;
  const stripY = size;
  for (let i = 0; i < colors.length; i++) {
    const col = colors[i];
    if (col.mode !== "hsl") continue;
    const { h, s, l } = col;
    ctx.fillStyle = `hsl(${h}, ${s * 100}%, ${l * 100}%)`;
    ctx.fillRect(i * rectWidth, stripY, rectWidth, stripHeight);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "black";
    ctx.strokeRect(i * rectWidth, stripY, rectWidth, stripHeight);
  }

  const png = canvas.encode("png");
  await Deno.writeFile(filename, png);
  console.log(`Saved ${filename}`);
}

// Example run
if (import.meta.main) {
  const example: HSLColor[] = [
    { mode: "hsl", h: 0, s: 0.5, l: 0.5 },
    { mode: "hsl", h: 120, s: 0.7, l: 0.5 },
    { mode: "hsl", h: 240, s: 0.6, l: 0.4 },
    { mode: "hsl", h: 300, s: 0.8, l: 0.6 },
  ];
  await drawHslWheel(example, "wheel_with_big_ticks.png", 600);
}
