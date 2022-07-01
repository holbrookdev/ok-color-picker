import state, { SLIDER_MODES } from "../../state";
import { oklabToOkhsl, oklabToOkhsv, sRgbToOklab } from "../../utils/color";
import { isHex, getHexTokensFromString, getRgbaFromHex } from "../../utils/hex";
import { updateSliderRangeInputs } from "../sliders/sliderRangeInputs";

export default function initAddressBar() {
  var hash = window.location.hash.substring(1);
  let hex = getHexTokensFromString(hash);

  if (isHex(hex)) {
    let [r, g, b, alpha] = getRgbaFromHex(hex);

    const fn =
      state.sliderMode === SLIDER_MODES.OKHSV ? oklabToOkhsv : oklabToOkhsl;

    const color = fn(...sRgbToOklab(r, g, b, alpha));
    const values = color.map((v, i: number) => v * state.currentSliders[i].max);
    updateSliderRangeInputs(values);
  }
}
