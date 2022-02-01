import {
  linear_srgb_to_oklab,
  okhsl_to_srgb,
  okhsv_to_srgb,
  oklab_to_linear_srgb,
  srgb_to_okhsl,
  srgb_to_okhsv,
  srgb_transfer_function,
  srgb_transfer_function_inv
} from "../lib/colorconversion";
import { round } from "./math";

export type Color = [number, number, number, number];
export type Tristimulus = [number, number, number];

export function okhsvToOklab(
  h: number,
  s: number,
  v: number,
  A: number
): Color {
  if (s === 0 && v === 1) {
    return [1, 0, 0, A];
  } else if (v === 0) {
    return [0, 0, 0, A];
  }
  const srgb = okhsv_to_srgb(h, s, v);
  const rgb = <[number, number, number]>(
    srgb.map((v) => srgb_transfer_function_inv(v / 255))
  );
  return <Color>[...linear_srgb_to_oklab(...rgb), A];
}

export function oklabToOkhsv(
  l: number,
  a: number,
  b: number,
  A: number
): Color {
  if (l === 1) {
    return [0, 0, 1, A];
  } else if (l === 0) {
    return [0, 0, 0, A];
  }
  const rgb = oklab_to_linear_srgb(l, a, b);
  const srgb = <Tristimulus>rgb.map((v) => 255 * srgb_transfer_function(v));
  const [h, s, v] = srgb_to_okhsv(...srgb);
  return <Color>[round(s, 6) <= 0 ? 0 : h, s, v, A];
}

export function okhslToOklab(
  h: number,
  s: number,
  l: number,
  A: number
): Color {
  if (l === 1) {
    return [1, 0, 0, A];
  } else if (l === 0) {
    return [0, 0, 0, A];
  }
  const srgb = okhsl_to_srgb(h, s, l);
  const rgb = <[number, number, number]>(
    srgb.map((v) => srgb_transfer_function_inv(v / 255))
  );
  return <Color>[...linear_srgb_to_oklab(...rgb), A];
}

export function oklabToSRgb(l: number, a: number, b: number, A: number): Color {
  const rgb = oklab_to_linear_srgb(l, a, b);
  const srgb = <Tristimulus>rgb.map((v) => 255 * srgb_transfer_function(v));
  return [...srgb, A];
}

export function oklabToOkhsl(
  l: number,
  a: number,
  b: number,
  A: number
): Color {
  if (l === 0.9999999934735462 || l === 1) {
    return [0, 0, 1, A];
  } else if (l === 0) {
    return [0, 0, 0, A];
  }
  const rgb = oklab_to_linear_srgb(l, a, b);
  const srgb = <Tristimulus>rgb.map((v) => 255 * srgb_transfer_function(v));
  const [h, s, l_] = srgb_to_okhsl(...srgb);
  return <Color>[round(s, 6) > 0 ? h : 0, s, l_, A];
}

export function oklabToHex(oklab: Color) {
  return sRgbToHex(...oklabToSRgb(...oklab));
}

function sRgbToHex(r: number, g: number, b: number, a: number) {
  const componentToHex = (x: number) => {
    return Math.round(x).toString(16).padStart(2, "0");
  };

  return (
    componentToHex(r) +
    componentToHex(g) +
    componentToHex(b) +
    (a < 1 ? componentToHex(a * 255) : "")
  );
}

export function sRgbToOklab(r: number, g: number, b: number, A: number): Color {
  const [l, a, b_] = linear_srgb_to_oklab(
    srgb_transfer_function_inv(r / 255),
    srgb_transfer_function_inv(g / 255),
    srgb_transfer_function_inv(b / 255)
  );
  return [l, a, b_, A];
}

export function relativeLuminanceW3C(
  r: number,
  g: number,
  b: number,
  _alpha?: number
) {
  const R = r <= 0.03928 ? r / 12.92 : ((r + 0.055) / 1.055) ** 2.4;
  const G = g <= 0.03928 ? g / 12.92 : ((g + 0.055) / 1.055) ** 2.4;
  const B = b <= 0.03928 ? b / 12.92 : ((b + 0.055) / 1.055) ** 2.4;

  // For the sRGB colorspace, the relative luminance of a color is defined as:
  const L = 0.2126 * R + 0.7152 * G + 0.0722 * B;

  return L;
}

export function contrastRatioW3C(srgb1: Color, srgb2: Color) {
  srgb1 = <Color>srgb1.map((v) => v / 255);
  srgb2 = <Color>srgb1.map((v) => v / 255);
  const [L1, L2] = [
    relativeLuminanceW3C(...srgb1),
    relativeLuminanceW3C(...srgb2)
  ];
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
