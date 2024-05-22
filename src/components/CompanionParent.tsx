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
import InfoButton from "./buttons/InfoButton.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import { Toaster } from "../../@/components/ui/toaster";
import IntroDialogue from "./dialogue/IntroDialogue.tsx";
import { PiPlugsConnected } from "react-icons/pi";
import { TbPlugConnected } from "react-icons/tb";

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
  const { setStartSession, displayRegistrationMessage } =
    useContext(AppContext);

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
            {t("Onepoint Data Wellness Companion")}™{" "}
            <span className="experimental">{t("Experimental")}</span>
          </h1>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-start cursor-pointer lg:items-center">
              <ConnectionStatus />
              {/* Language drop down */}
              <div>
                {" "}
                <LanguagesBtn />
              </div>{" "}
              <div>
                <InfoButton />
              </div>
              <StartButton />
            </div>
          </div>
        </div>
      </div>
      <NodeNavigation />
      <div className="container">
        {displayRegistrationMessage && <RegistrationMessage />}
        {!displayRegistrationMessage && <InteractionPanel />}
        <Disclaimer />
      </div>
      <Toaster />
    </>
  );
}
