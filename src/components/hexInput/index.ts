import state, { SLIDER_MODES } from "../../state";
import {
  oklabToHex,
  oklabToOkhsl,
  oklabToOkhsv,
  sRgbToOklab
} from "../../utils/color";
import { isHex, getHexTokensFromString, getRgbaFromHex } from "../../utils/hex";
import {
  getOklab,
  updateSliderRangeInputs
} from "../sliders/sliderRangeInputs";
import "./style.css";

let focused = false;

export const hexInputEl = <HTMLInputElement>(
  document.querySelector("#hexInput input[type='text']")
);

export default function initHexInput() {
  hexInputEl.addEventListener("click", handleFocus);
  hexInputEl.addEventListener("blur", handleBlur);
  hexInputEl.addEventListener("keydown", handleKeydown);
}

export function updateHexInput(value: string) {
  hexInputEl.value = `${value}`;
}

function handleFocus(e: Event) {
  const el = <HTMLInputElement>e.target;
  if (!focused) {
    el.select();
    focused = true;
  }
}

function handleInput(e: Event) {
  const el = <HTMLInputElement>e.target;
  let hex = getHexTokensFromString(el.value);

  if (isHex(hex)) {
    let [r, g, b, alpha] = getRgbaFromHex(hex);

    const fn =
      state.sliderMode === SLIDER_MODES.OKHSV ? oklabToOkhsv : oklabToOkhsl;

    const color = fn(...sRgbToOklab(r, g, b, alpha));
    const values = color.map((v, i: number) => v * state.currentSliders[i].max);
    updateSliderRangeInputs(values, true);
  }
}

function handleBlur(e: Event) {
  handleInput(e);
  reset();
}

function reset() {
  updateHexInput(oklabToHex(getOklab()));
}

function handleKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case "Enter": {
      handleInput(e);
      break;
    }
  }
}
