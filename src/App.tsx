import { Route, Routes } from "react-router-dom";
import "./App.css";
import CompanionParent from "./components/CompanionParent.tsx";
import { AppContextProvider } from "./context/AppContext.tsx";
import { ConfigContextProvider } from "./context/ChatContext.tsx";

function App() {
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
