export type Slider = {
  id: string;
  min: number;
  max: number;
  unit: number;
  value: number;
  symbol: string;
};

export type Sliders = [Slider, Slider, Slider, Slider];

export const SLIDER_MODES = {
  OKHSV: "OKHSV",
  OKHSL: "OKHSL"
};

type StateType = {
  sliderMode: string;
  setSliderMode: Function;
  sliders: {
    [index: string]: Sliders;
    OKHSV: Sliders;
    OKHSL: Sliders;
  };
  readonly currentSliders: Sliders;
};

const State: StateType = {
  sliderMode: SLIDER_MODES.OKHSL,
  setSliderMode(mode: string) {
    this.sliderMode = mode;
  },
  sliders: {
    OKHSV: [
      {
        id: "Hue",
        min: 0,
        max: 360,
        unit: 1,
        value: 211,
        symbol: ""
      },
      {
        id: "Saturation",
        min: 0,
        max: 100,
        unit: 1,
        value: 93,
        symbol: "%"
      },
      {
        id: "Value",
        min: 0,
        max: 100,
        unit: 1,
        value: 58,
        symbol: "%"
      },
      {
        id: "Alpha",
        min: 0,
        max: 100,
        unit: 1,
        value: 100,
        symbol: "%"
      }
    ],
    OKHSL: [
      {
        id: "Hue",
        min: 0,
        max: 360,
        unit: 1,
        value: 211,
        symbol: ""
      },
      {
        id: "Saturation",
        min: 0,
        max: 100,
        unit: 1,
        value: 91,
        symbol: "%"
      },
      {
        id: "Lightness",
        min: 0,
        max: 100,
        unit: 1,
        value: 47,
        symbol: "%"
      },
      {
        id: "Alpha",
        min: 0,
        max: 100,
        unit: 1,
        value: 100,
        symbol: "%"
      }
    ]
  },
  get currentSliders(): Sliders {
    return this.sliders[this.sliderMode];
  }
};

export default State;
