export default function initGitHubButton() {
  const githubButtonEl = <HTMLButtonElement>(
    document.querySelector("#githubButton")
  );

  if (!window.navigator.onLine) {
    githubButtonEl.style.display = "none";
  }

  window.addEventListener(
    "online",
    () => (githubButtonEl.style.display = "inherit")
  );

  window.addEventListener(
    "offline",
    () => (githubButtonEl.style.display = "none")
  );
}
