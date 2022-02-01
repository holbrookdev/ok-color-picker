import { Slider, Sliders, SLIDER_MODES } from "../state";
import {
  Color,
  contrastRatioW3C,
  okhslToOklab,
  okhsvToOklab,
  oklabToSRgb
} from "./color";
import { oklabToHex } from "./color";

const CONTRAST_RATIO = 4.5;
const ALPHA_THRESHOLD = 50;

export function updateColors(
  hex: string,
  oklab: Color,
  hue: number,
  saturation: number,
  lightnessOrValue: number,
  alpha: number,
  SLIDERS: Sliders,
  currentSliderMode: string
) {
  const cr = contrastRatioW3C(oklabToSRgb(...oklab), oklabToSRgb(0, 0, 0, 0));
  updateBackgroundColor(hex);
  updateTextColor(cr, alpha);
  updateSliderColors(
    hue,
    saturation,
    lightnessOrValue,
    alpha,
    SLIDERS,
    currentSliderMode
  );
  updateBrightnessFilter(cr);
  updateMetaThemeColor(hex);
}

function updateMetaThemeColor(hex: string) {
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", `#${hex}`);
}

function updateBrightnessFilter(contrastRatio: number) {
  const filter =
    contrastRatio < CONTRAST_RATIO ? "brightness(109%)" : "brightness(91%)";
  document.documentElement.style.setProperty("--brightnessFilter", `${filter}`);
}

function updateTextColor(contrastRatio: number, alpha: number) {
  const textColor =
    contrastRatio < CONTRAST_RATIO && alpha > ALPHA_THRESHOLD
      ? "ffffff"
      : "000000";
  document.documentElement.style.setProperty("--textColor", `#${textColor}`);
}

function updateBackgroundColor(hex: string) {
  document.documentElement.style.setProperty("--backgroundColor", `#${hex}`);
}

function updateSliderColors(
  hue: number,
  saturation: number,
  lightnessOrValue: number,
  alpha: number,
  SLIDERS: Sliders,
  currentSliderMode: string
) {
  const fn =
    currentSliderMode === SLIDER_MODES.OKHSV ? okhsvToOklab : okhslToOklab;
  SLIDERS.forEach((_slider: Slider, key) => {
    switch (key) {
      case 0: {
        const stops = new Array(16).fill(String()).map((_v, i) => {
          const oklab = fn(
            i / 15,
            saturation / SLIDERS[1].max,
            lightnessOrValue / SLIDERS[2].max,
            alpha / SLIDERS[3].max
          );
          return `#${oklabToHex(oklab)}`;
        });
        document.documentElement.style.setProperty(
          "--sliderBackground1",
          `linear-gradient(to right, ${stops})`
        );
        break;
      }
      case 1: {
        const stops = new Array(16).fill(String()).map((_v, i) => {
          const oklab = fn(
            hue / SLIDERS[0].max,
            i / 15,
            lightnessOrValue / SLIDERS[2].max,
            alpha / SLIDERS[3].max
          );
          return `#${oklabToHex(oklab)}`;
        });
        document.documentElement.style.setProperty(
          "--sliderBackground2",
          `linear-gradient(to right, ${stops})`
        );
        break;
      }
      case 2: {
        const stops = new Array(16).fill(String()).map((_v, i) => {
          const oklab = fn(
            hue / SLIDERS[0].max,
            saturation / SLIDERS[1].max,
            i / 15,
            alpha / SLIDERS[3].max
          );
          return `#${oklabToHex(oklab)}`;
        });
        document.documentElement.style.setProperty(
          "--sliderBackground3",
          `linear-gradient(to right, ${stops})`
        );
        break;
      }
      case 3: {
        const stops = new Array(16).fill(String()).map((_v, i) => {
          const oklab = fn(
            hue / SLIDERS[0].max,
            saturation / SLIDERS[1].max,
            lightnessOrValue / SLIDERS[2].max,
            i / 15
          );
          return `#${oklabToHex(oklab)}`;
        });
        document.documentElement.style.setProperty(
          "--sliderBackground4",
          `linear-gradient(to right, ${stops})`
        );
        break;
      }
      default:
        break;
    }
  });
}
