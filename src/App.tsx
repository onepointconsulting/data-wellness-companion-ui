import { AppContextProvider } from "./context/AppContext.tsx";
import CompanionParent from "./components/CompanionParent.tsx";
import { ConfigContextProvider } from "./context/ChatContext.tsx";
import { Route, Routes } from "react-router-dom";
import { DarkModeContextProvider } from "./context/DarkModeContext.tsx";
import { IntroContextProvider } from "./components/intro/IntroContext.tsx";
import AdminApp from "./AdminApp.tsx";

function App() {
  return (
    <IntroContextProvider>
      <AppContextProvider>
        <ConfigContextProvider>
          <DarkModeContextProvider>
            <Routes>
              <Route path="/admin" element={<AdminApp />} />
              <Route path="/admin/*" element={<AdminApp />} />
              <Route path="*" element={<CompanionParent />} />
            </Routes>
          </DarkModeContextProvider>
        </ConfigContextProvider>
      </AppContextProvider>
    </IntroContextProvider>
  );
}

export default App;
