import state, { SLIDER_MODES } from "../../state";
import { oklabToOkhsl, oklabToOkhsv } from "../../utils/color";
import {
  getOklab,
  updateSliderRangeInputs
} from "../sliders/sliderRangeInputs";
import "./style.css";

export const colorModeToggleButtonEls = <NodeListOf<HTMLButtonElement>>(
  document.querySelectorAll("#colorModeToggle button")
);

export default function initColorModeToggle() {
  return new Promise((resolve) => {
    const sliderModes = Object.values(SLIDER_MODES);
    colorModeToggleButtonEls.forEach((el: HTMLButtonElement, key) => {
      el.addEventListener("click", toggleColorMode);
      if (state.sliderMode === sliderModes[key]) {
        el.classList.add("active");
      }
    });
    resolve(true);
  });
}

function toggleColorMode(e: Event) {
  const el = <HTMLButtonElement>e.target;
  el.classList.toggle("active");
  el.nextElementSibling
    ? el.nextElementSibling.classList.toggle("active")
    : el.parentElement?.firstElementChild?.classList.toggle("active");
  switch (state.sliderMode) {
    case SLIDER_MODES.OKHSL: {
      updateSliderRangeInputs(
        oklabToOkhsv(...getOklab()).map(
          (v, i) => v * state.sliders.OKHSV[i].max
        ),
        false,
        true
      );
      break;
    }
    case SLIDER_MODES.OKHSV: {
      updateSliderRangeInputs(
        oklabToOkhsl(...getOklab()).map(
          (v, i) => v * state.sliders.OKHSL[i].max
        ),
        false,
        true
      );
      break;
    }
  }
}
