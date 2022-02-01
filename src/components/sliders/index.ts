import "./style.css";
import initSliderRangeInputs from "./sliderRangeInputs";
import initSliderTextInputs from "./sliderTextInputs";

export default function initSliders() {
  return new Promise((resolve) => {
    initSliderRangeInputs()
      .then(initSliderTextInputs)
      .then(() => resolve(true));
  });
}
