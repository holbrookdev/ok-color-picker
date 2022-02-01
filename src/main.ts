import "./css/reset.css";
import "./css/utils.css";
import "./css/font.css";
import "./css/style.css";
import initHexInput from "./components/hexInput";
import initActionBar from "./components/actionBar";
import initSliders from "./components/sliders";
import initPWA from "./pwa";
import initGitHubButton from "./components/githubButton";

initSliders().then(initHexInput).then(initActionBar);
initPWA();
initGitHubButton();
