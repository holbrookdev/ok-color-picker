import "./style.css";
import { updateSliderRangeInput } from "../sliderRangeInputs";
import state from "../../../state";

export const sliderTextInputEls = <NodeListOf<HTMLInputElement>>(
  document.querySelectorAll(".slider input[type='text']")
);

export default function initSliderTextInputs() {
  sliderTextInputEls.forEach((el: HTMLInputElement, key: number) => {
    el.addEventListener("focus", (e: Event) => handleFocus(e, key));
    el.addEventListener("blur", (e: Event) => handleBlur(e, key));
    el.addEventListener("keydown", (e: KeyboardEvent) => handleKeydown(e, key));
  });
}

export function updateSliderTextInput(
  value: number,
  key: number,
  useSymbol: boolean = false,
  forceUpdate: boolean = false,
  skipUpdateSlider: boolean = false
) {
  if (isNaN(value)) {
    return;
  }

  const el = sliderTextInputEls[key];
  const currentValue = parseFloat(el.value);
  const roundedValue = Math.round(value);

  if (valueIsNotWithinRange(roundedValue, key)) {
    el.value = useSymbol
      ? `${state.currentSliders[key].value}${state.currentSliders[key].symbol}`
      : String(state.currentSliders[key].value);
    return;
  }

  if (currentValue !== value || forceUpdate) {
    el.value = useSymbol
      ? `${roundedValue}${state.currentSliders[key].symbol}`
      : String(roundedValue);
    if (!skipUpdateSlider) {
      updateSliderRangeInput(roundedValue, key);
    }
  }
}

function valueIsNotWithinRange(value: number, key: number) {
  if (
    value < state.currentSliders[key].min ||
    value > state.currentSliders[key].max
  ) {
    return true;
  }
  return false;
}

function handleFocus(e: Event, key: number) {
  updateSliderTextInput(
    parseFloat((<HTMLInputElement>e.target).value),
    key,
    false,
    true
  );
}

function handleBlur(e: Event, key: number) {
  updateSliderTextInput(
    parseFloat((<HTMLInputElement>e.target).value),
    key,
    true,
    true
  );
}

function handleKeydown(e: KeyboardEvent, key: number) {
  const el = <HTMLInputElement>e.target;
  let value = parseFloat(el.value) || 0;

  switch (e.key) {
    case "Enter": {
      el.blur();
      break;
    }
    case "ArrowUp": {
      value += state.currentSliders[key].unit;
      updateSliderTextInput(value, key);
      break;
    }
    case "ArrowDown": {
      value -= state.currentSliders[key].unit;
      updateSliderTextInput(value, key);
      break;
    }
  }
}
