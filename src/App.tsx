import { AppContextProvider } from "./context/AppContext.tsx";
import CompanionParent from "./components/CompanionParent.tsx";
import { ConfigContextProvider } from "./context/ChatContext.tsx";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { getSeenIntro } from "./lib/sessionFunctions.ts";
import { showDialogue } from "./lib/dialogFunctions.ts";
import { INTRO_DIALOGUE_ID } from "./components/dialogue/IntroDialogue.tsx";
import { DarkModeContextProvider } from "./context/DarkModeContext.tsx";

function App() {
  useEffect(() => {
    if (!getSeenIntro()) {
      showDialogue(INTRO_DIALOGUE_ID);
    }
  }, []);
  return (
    <AppContextProvider>
      <ConfigContextProvider>
        <DarkModeContextProvider>
          <Routes>
            <Route path="*" element={<CompanionParent />} />
          </Routes>
        </DarkModeContextProvider>
      </ConfigContextProvider>
    </AppContextProvider>
  );
}

export default App;
