import "./App.css";
import { AppContextProvider } from "./context/AppContext.tsx";
import CompanionParent from "./components/CompanionParent.tsx";
import { ConfigContextProvider } from "./context/ChatContext.tsx";
import { Routes, Route } from "react-router-dom";
import {useEffect} from "react";
import {getSeenIntro} from "./lib/sessionFunctions.ts";
import {showDialogue} from "./lib/dialogFunctions.ts";
import {INTRO_DIALOGUE_ID} from "./components/dialogue/IntroDialogue.tsx";

function App() {
  useEffect(() => {
    if(!getSeenIntro()) {
      showDialogue(INTRO_DIALOGUE_ID)
    }
  }, []);
  return (
    <AppContextProvider>
      <ConfigContextProvider>
        <Routes>
          <Route path="*" element={<CompanionParent />} />
        </Routes>
      </ConfigContextProvider>
    </AppContextProvider>
  );
}

export default App;
