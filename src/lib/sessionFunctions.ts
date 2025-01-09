import { Session } from "../model/session.ts";

export const SESSION_KEY = "session";

export const SESSION_HISTORY_KEY = "history";

export const SEEN_INTRO_KEY = "seenIntro";

const SEEN_INTRO_VALUE = "true";

export function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): Session | null {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try {
      const sessionObj = JSON.parse(session);
      if (typeof sessionObj.timestamp === "string") {
        return {
          id: sessionObj.id,
          timestamp: new Date(sessionObj.timestamp),
          language: sessionObj.language ?? "en",
        };
      }
    } catch (e) {
      console.error("Error getting session from local storage", e);
    }
  }
  return null;
}

export function getSessionHistory(): Session[] {
  const sessionHistory = localStorage.getItem(SESSION_HISTORY_KEY);
  if (sessionHistory) {
    try {
      const sessionHistoryObj = JSON.parse(sessionHistory);
      if (Array.isArray(sessionHistoryObj)) {
        return sessionHistoryObj.map((session: any) => ({
          id: session.id,
          timestamp: new Date(session.timestamp),
          finished: session.finished,
          language: session.language ?? "en",
        }));
      }
    } catch (e) {
      console.error("Error getting session history from local storage", e);
    }
  }
  return [];
}

function saveSessionHistory(sessionHistory: Session[]) {
  localStorage.setItem(SESSION_HISTORY_KEY, JSON.stringify(sessionHistory));
}

export function appendToSessionHistory(
  currentSession: Session,
  hasFinalReport: boolean,
) {
  currentSession.finished = hasFinalReport;
  const sessionHistory = localStorage.getItem(SESSION_HISTORY_KEY);
  if (sessionHistory) {
    try {
      const sessionHistoryObj = JSON.parse(sessionHistory);
      if (Array.isArray(sessionHistoryObj)) {
        if (!sessionHistoryObj.map((session) => session.id).find(id => id === currentSession.id)) {
          // Only insert if it's not already in the history
          sessionHistoryObj.push(currentSession);
          saveSessionHistory(sessionHistoryObj);
        }
      }
    } catch (e) {
      console.error("Error appending session to history", e);
    }
  } else {
    saveSessionHistory([currentSession]);
  }
}

export function getSeenIntro(): boolean {
  const seenIntro = localStorage.getItem(SEEN_INTRO_KEY);
  return seenIntro === SEEN_INTRO_VALUE;
}

export function hasSeenIntro() {
  localStorage.setItem(SEEN_INTRO_KEY, SEEN_INTRO_VALUE);
}

export function forgetSeenIntro() {
  localStorage.removeItem(SEEN_INTRO_KEY);
}
