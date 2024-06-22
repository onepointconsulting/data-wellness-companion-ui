import NodeNavigation from "./NodeNavigation.tsx";
import { useWebsocket } from "../hooks/useWebsocket.ts";
import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";
import InteractionPanel from "./InteractionPanel.tsx";
import InfoToolTip from "./buttons/InfoTooltip.tsx";
import LanguagesBtn from "./buttons/LanguagesBtn.tsx";
import StartButton from "./buttons/StartButton.tsx";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import Disclaimer from "./Disclaimer.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import { Toaster } from "../../@/components/ui/toaster";
import IntroDialogue from "./dialogue/IntroDialogue.tsx";
import { PiPlugsConnected } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";
import LanguageDropDown from "./buttons/LanguageDropDown.tsx";
import InfoButton from "./buttons/InfoButton.tsx";
import ThemeSwitcher from "./theme/ThemeSwitcher.tsx";
import { SpinnerRoundOutlined } from "spinners-react";

function ConnectionStatus() {
  const { t } = useTranslation();
  const { connected } = useContext(AppContext);

  return (
    <div className="connection-status">
      {connected ? (
        <PiPlugsConnected className="info-button" title={t("connected")} />
      ) : (
        <TbPlugConnected className="info-button" title={t("disconnected")} />
      )}
    </div>
  );
}
export default function CompanionParent() {
  const { t } = useTranslation();
  const {
    setStartSession,
    languageOpen,
    restartOpen,
    displayRegistrationMessage,
    connected,
  } = useContext(AppContext);

  useChatHistory();

  // Update the state of the session to start
  useEffect(() => {
    setStartSession(true);
  }, []);

  // Establish a websocket connection
  useWebsocket();

  return (
    <>
      <RestartDialogue />
      <EmailDialogue />
      <InfoDialogue />
      <IntroDialogue />
      <InfoToolTip />
      <div className="header">
        <div className="header-container">
          <h1>
            {t("HopeLink Chat Companion")}™{" "}
            <span className="experimental">{t("Experimental")}</span>
          </h1>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-start cursor-pointer lg:items-center">
              <ConnectionStatus />
              {/* Language drop down */}
              <div className="relative flex items-center">
                <LanguagesBtn />
                <StartButton />
                <InfoButton />
                {/* dark mood icon */}
                <div className="cursor-pointer hover:scale-110 hover:duration-200 hover:transform">
                  <ThemeSwitcher />
                </div>
                {restartOpen && <RestartDialogue />}
                {languageOpen && <LanguageDropDown />}
              </div>{" "}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation bar */}
      {!connected ? (
        <div className="container">
          <div className="flex flex-row items-center justify-center min-h-screen m-4 border">
            <h2 className="flex items-center">
              {t("Connecting to the server")}...{" "}
              <SpinnerRoundOutlined
                size={50}
                thickness={100}
                speed={100}
                color="#36ad47"
              />{" "}
            </h2>
          </div>
        </div>
      ) : (
        <>
          {" "}
          <NodeNavigation />
          {/* Main chat section */}
          <div className="container">
            {displayRegistrationMessage && <RegistrationMessage />}
            {!displayRegistrationMessage && <InteractionPanel />}
            <Disclaimer />
          </div>
        </>
      )}

      <Toaster />
    </>
  );
}
