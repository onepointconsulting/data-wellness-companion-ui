import { getSession } from "./sessionFunctions.ts";

function buildKey(sessionId: string) {
  return `displayedConfidenceLevelProceedWarning_${sessionId}`;
}

export function saveDisplayedConfidenceLevelProceedWarning(
  displayedConfidenceLevelProceedWarning: boolean,
  setDisplayedConfidenceLevelProceedWarning: (v: boolean) => void,
) {
  setDisplayedConfidenceLevelProceedWarning(
    displayedConfidenceLevelProceedWarning,
  );
  const sessionId = getSession()?.id;
  if (sessionId) {
    window.localStorage[buildKey(sessionId)] =
      `${displayedConfidenceLevelProceedWarning}`;
  } else {
    console.error("Could not find session id");
  }
}

export function readDisplayedConfidenceLevelProceedWarning(): boolean {
  const sessionId = getSession()?.id;
  if (!sessionId) {
    return false;
  }
  return window.localStorage[buildKey(sessionId)] === "true";
}
