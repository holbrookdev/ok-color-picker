import "./style.css";
import { Color, oklabToHex } from "../../../utils/color";
import state, { SLIDER_MODES } from "../../../state";
import { updateSliderTextInput } from "../sliderTextInputs";
import { okhsvToOklab, okhslToOklab } from "../../../utils/color";
import { updateHexInput } from "../../hexInput";
import { updateColors } from "../../../utils/dom";

export const sliderRangeLabelEls = <NodeListOf<HTMLLabelElement>>(
  document.querySelectorAll(".sliderLabel")
);

export const sliderRangeInputEls = <NodeListOf<HTMLInputElement>>(
  document.querySelectorAll(".slider input[type='range']")
);

export default function initSliderRangeInputs() {
  return new Promise((resolve) => {
    sliderRangeInputEls.forEach((el: HTMLInputElement, key: number) => {
      el.min = String(state.currentSliders[key].min);
      el.max = String(state.currentSliders[key].max);
      el.addEventListener("input", (e: Event) => handleInput(e, key));
      el.addEventListener("change", (e: Event) => handleChange(e, key));
      updateSliderRangeInput(state.currentSliders[key].value, key);
    });
    updateSliderLabels();
    resolve(true);
  });
}

export function toggleCurrentSliderMode() {
  state.setSliderMode(
    state.sliderMode === SLIDER_MODES.OKHSV
      ? SLIDER_MODES.OKHSL
      : SLIDER_MODES.OKHSV
  );
  updateSliderLabels();
}

function updateSliderLabels() {
  sliderRangeLabelEls.forEach((el: HTMLLabelElement, key: number) => {
    el.innerText = state.currentSliders[key].id;
  });
}

function getSliderEls() {
  const sliders: HTMLInputElement[] = [];
  sliderRangeInputEls.forEach((v, i: number) => (sliders[i] = v));
  return sliders;
}

export function getOklab() {
  switch (state.sliderMode) {
    case SLIDER_MODES.OKHSV: {
      const okhsv = <Color>(
        state.currentSliders.map(
          (_el, i: number) =>
            parseFloat(String(state.currentSliders[i].value)) /
            state.currentSliders[i].max
        )
      );
      return okhsvToOklab(...okhsv);
    }
    case SLIDER_MODES.OKHSL: {
      const okhsl = <Color>(
        state.currentSliders.map(
          (_el, i: number) =>
            parseFloat(String(state.currentSliders[i].value)) /
            state.currentSliders[i].max
        )
      );
      return okhslToOklab(...okhsl);
    }
    default:
      return <Color>[0, 0, 0, 0];
  }
}

export function getValue(value: number, key: number) {
  return !value
    ? 0
    : value > state.currentSliders[key].max
    ? state.currentSliders[key].max
    : value < state.currentSliders[key].min
    ? state.currentSliders[key].min
    : value;
}

function handleSync(skipHexInput: boolean = false) {
  const oklab = getOklab();
  const hex = oklabToHex(oklab);
  if (!skipHexInput) {
    updateHexInput(hex);
  }
  updateDomColors(hex, oklab);
}

function handleAsync() {}

export function updateDomColors(hex: string, oklab: Color) {
  const sliders = getSliderEls();
  const hue = parseFloat(sliders[0].value);
  const saturation = parseFloat(sliders[1].value);
  const lightnessOrValue = parseFloat(sliders[2].value);
  const alpha = parseFloat(sliders[3].value);
  updateColors(
    hex,
    oklab,
    hue,
    saturation,
    lightnessOrValue,
    alpha,
    state.currentSliders,
    String(state.sliderMode)
  );
}

export function updateSliderRangeInputs(
  values: number[],
  skipHexInput: boolean = false,
  toggleColorMode: boolean = false
) {
  if (toggleColorMode) {
    toggleCurrentSliderMode();
  }
  sliderRangeInputEls.forEach((el, i: number) => {
    el.value = String(values[i]);
    state.currentSliders[i].value = values[i];
    updateSliderTextInput(values[i], i, true, false, true);
  });
  handleSync(skipHexInput);
  handleAsync();
}

export function updateSliderRangeInput(
  value: number,
  key: number,
  forceUpdate: boolean = false,
  async: boolean = false
) {
  const el = sliderRangeInputEls[key];
  const currentValue = parseFloat(el.value);

  const newValue = getValue(value, key);

  let sync = false;

  if (currentValue !== newValue || forceUpdate) {
    el.value = String(value);
    state.currentSliders[key].value = value;
    updateSliderTextInput(value, key, true, false, true);
    sync = true;
  } else if (newValue !== value) {
    updateSliderTextInput(newValue, key, false, false, true);
    sync = true;
  }

  if (sync) {
    handleSync();
  }

  if (async) {
    handleAsync();
  }
}

function handleInput(e: Event, key: number) {
  updateSliderRangeInput(
    parseFloat((<HTMLInputElement>e.target).value),
    key,
    true
  );
}

function handleChange(e: Event, key: number) {
  updateSliderRangeInput(
    parseFloat((<HTMLInputElement>e.target).value),
    key,
    false,
    true
  );
}
