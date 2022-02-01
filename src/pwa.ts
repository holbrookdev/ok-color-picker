import { registerSW } from "virtual:pwa-register";

const intervalMS = 60 * 60 * 1000;

export default function initPWA() {
  const updateSW = registerSW({
    onRegistered(registration) {
      registration &&
        setInterval(() => {
          registration.update();
        }, intervalMS);
    },
    onNeedRefresh() {
      if (confirm("New content available! Click OK button to update.")) {
        updateSW();
      }
    }
  });
}
