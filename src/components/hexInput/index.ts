import state, { SLIDER_MODES } from "../../state";
import {
  oklabToHex,
  oklabToOkhsl,
  oklabToOkhsv,
  sRgbToOklab
} from "../../utils/color";
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
  return new Promise((resolve) => {
    hexInputEl.addEventListener("click", handleFocus);
    hexInputEl.addEventListener("blur", handleBlur);
    hexInputEl.addEventListener("keydown", handleKeydown);
    resolve(true);
  });
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
  let tokens = getHexTokens(el.value);

  if (isHex(tokens)) {
    let [r, g, b, alpha] = tokens!.map((v: string) =>
      v.length === 1 ? parseInt(v + v, 16) : parseInt(v, 16)
    );

    alpha = alpha === undefined ? 1 : alpha / 255;

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

function getHexTokens(value: string) {
  let tokens = value.match(
    /^#*([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$|^#*([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$|^#*([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})([a-f0-9]{1})$|^#*([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i
  );
  tokens ??= [];
  tokens &&= tokens.slice(1).filter((v) => !!v); // remove complete match and null matches
  return tokens;
}

function isHex(tokens: string[]) {
  return !tokens?.length ? false : true;
}
