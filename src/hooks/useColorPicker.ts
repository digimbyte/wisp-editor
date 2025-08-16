import { useCallback, useMemo, useState } from 'react';

export interface HSV { h: number; s: number; v: number }
export interface RGB { r: number; g: number; b: number }
export interface Color extends HSV, RGB { hex: string }

function clamp(n: number, min: number, max: number) { return Math.max(min, Math.min(max, n)); }

export function hsvToRgb(h: number, s: number, v: number): RGB {
  // h: 0-360, s: 0-100, v: 0-100
  s = clamp(s, 0, 100) / 100;
  v = clamp(v, 0, 100) / 100;
  const C = v * s;
  const X = C * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - C;
  let r1 = 0, g1 = 0, b1 = 0;
  if (0 <= h && h < 60) [r1, g1, b1] = [C, X, 0];
  else if (60 <= h && h < 120) [r1, g1, b1] = [X, C, 0];
  else if (120 <= h && h < 180) [r1, g1, b1] = [0, C, X];
  else if (180 <= h && h < 240) [r1, g1, b1] = [0, X, C];
  else if (240 <= h && h < 300) [r1, g1, b1] = [X, 0, C];
  else [r1, g1, b1] = [C, 0, X];
  const r = Math.round((r1 + m) * 255);
  const g = Math.round((g1 + m) * 255);
  const b = Math.round((b1 + m) * 255);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }: RGB): string {
  const toHex = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function hexToRgb(hex: string): RGB | null {
  const m = /^#?([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/.exec(hex);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

export function rgbToHsv(r: number, g: number, b: number): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d === 0) h = 0;
  else if (max === r) h = 60 * (((g - b) / d) % 6);
  else if (max === g) h = 60 * ((b - r) / d + 2);
  else h = 60 * ((r - g) / d + 4);
  if (h < 0) h += 360;
  const s = max === 0 ? 0 : d / max;
  const v = max;
  return { h, s: s * 100, v: v * 100 };
}

export function useColorPicker(initial: Partial<Color> = {}) {
  const [h, setH] = useState(initial.h ?? 0);
  const [s, setS] = useState(initial.s ?? 100);
  const [v, setV] = useState(initial.v ?? 100);

  const rgb = useMemo(() => hsvToRgb(h, s, v), [h, s, v]);
  const hex = useMemo(() => rgbToHex(rgb), [rgb]);

  const setHue = useCallback((hh: number) => setH(clamp(hh, 0, 360)), []);
  const setSaturation = useCallback((ss: number) => setS(clamp(ss, 0, 100)), []);
  const setValue = useCallback((vv: number) => setV(clamp(vv, 0, 100)), []);

  const setHex = useCallback((hexStr: string) => {
    const rgbVal = hexToRgb(hexStr);
    if (!rgbVal) return;
    const hsv = rgbToHsv(rgbVal.r, rgbVal.g, rgbVal.b);
    setH(hsv.h); setS(hsv.s); setV(hsv.v);
  }, []);

  const setColor = useCallback((c: Partial<Color>) => {
    if (c.hex) {
      const rgbVal = hexToRgb(c.hex);
      if (rgbVal) {
        const hsv = rgbToHsv(rgbVal.r, rgbVal.g, rgbVal.b);
        setH(hsv.h); setS(hsv.s); setV(hsv.v);
        return;
      }
    }
    if (c.h != null) setH(clamp(c.h, 0, 360));
    if (c.s != null) setS(clamp(c.s, 0, 100));
    if (c.v != null) setV(clamp(c.v, 0, 100));
  }, []);

  return {
    color: { h, s, v, ...rgb, hex },
    setHue,
    setSaturation,
    setValue,
    setHex,
    setColor,
  } as const;
}

