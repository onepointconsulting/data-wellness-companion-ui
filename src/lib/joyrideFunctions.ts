// Update date when new tour available.
export const KEY_FINISHED = "tourFinished_20241214";
export const KEY_AUTO_START = "tourAutoStart";

export function isFinished() {
  return window.localStorage.getItem(KEY_FINISHED) === "true";
}

export function setTourFinished() {
  window.localStorage.setItem(KEY_FINISHED, "true");
}

export function setAutoStart(autoStart: boolean) {
  window.localStorage.setItem(KEY_AUTO_START, autoStart ? "true" : "false");
}

export function isAutoStart() {
  return window.localStorage.getItem(KEY_AUTO_START) === "true";
}
