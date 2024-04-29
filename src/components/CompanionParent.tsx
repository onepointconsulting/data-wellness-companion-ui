import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import { useWebsocket } from "../hooks/useWebsocket.ts";
import Disclaimer from "./Disclaimer.tsx";
import InteractionPanel from "./InteractionPanel.tsx";
import NodeNavigation from "./NodeNavigation.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import InfoButton from "./buttons/InfoButton.tsx";
import InfoToolTip from "./buttons/InfoTooltip.tsx";
import LanguagesBtn from "./buttons/LanguagesBtn.tsx";
import StartButton from "./buttons/StartButton.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";

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
      {/* <InfoDialogue /> */}
      <InfoToolTip />

      <div className="header">
        <div className="py-4 header-container">
          <h1>
            {t("Onepoint Data Wellness Companion")}™{" "}
            <span className="experimental">{t("Experimental")}</span>
          </h1>
          <div className="flex flex-col items-center">
            <div className="flex flex-row items-start cursor-pointer lg:items-center">
              {/* Language drop down */}
              <div className="relative">
                {" "}
                <LanguagesBtn />
              </div>{" "}
              <div data-tooltip-id="user-info-tooltip">
                <InfoButton />
              </div>
              <StartButton />
            </div>
          </div>
        </div>
      </div>
      <NodeNavigation />
      {displayRegistrationMessage && <RegistrationMessage />}
      {!displayRegistrationMessage && <InteractionPanel />}
      <Disclaimer />
    </>
  );
}
