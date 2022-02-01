import initColorModeToggle from "../colorModeToggle";
import "./style.css";

export default function initActionBar() {
  return new Promise((resolve) => {
    initColorModeToggle().then(() => {
      resolve(true);
    });
  });
}
