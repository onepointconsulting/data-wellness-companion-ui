import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AppContext, COOKIE_STATES } from "../context/AppContext.tsx";
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
import LanguageDropDown from "./buttons/LanguageDropDown.tsx";
import CookieDialogue from "./dialogue/CookieDialogue.tsx";
import { SiWelcometothejungle } from "react-icons/si";

export default function CompanionParent() {
  const { t } = useTranslation();
  const {
    setStartSession,
    languageOpen,
    restartOpen,
    cookieState,
    displayRegistrationMessage,
  } = useContext(AppContext);

  useChatHistory();

  // Update the state of the session to start
  useEffect(() => {
    setStartSession(true);
  }, []);

  // Establish a websocket connection
  useWebsocket();

  return (
    <div className="relative w-full lg:container">
      <EmailDialogue />
      {/* <InfoDialogue /> */}
      <InfoToolTip />

      <div className="header">
        <div className="py-4 header-container">
          <h1>
            {t("HopeLink Chat Companion")}
            <span className="mx-4 experimental">{t("Experimental")}</span>
          </h1>
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-start cursor-pointer lg:items-center">
              {/* Language drop down */}
              <div data-tooltip-id="user-info-tooltip">
                <InfoButton />
              </div>
              <div className="relative flex items-center">
                {" "}
                <LanguagesBtn />
                <StartButton />
                {restartOpen && <RestartDialogue />}
                {languageOpen && <LanguageDropDown />}
              </div>{" "}
            </div>
          </div>
        </div>
      </div>

      {cookieState !== COOKIE_STATES.UNKNOWN && !displayRegistrationMessage ? (
        <>
          <NodeNavigation />
          {displayRegistrationMessage && <RegistrationMessage />}
          <InteractionPanel />
          <Disclaimer />
        </>
      ) : (
        <div className="flex items-center justify-center text-gray-800 mt-9">
          <div className="flex items-center gap-4 text-center">
            <h2 className="mb-4 text-5xl font-semibold">
              {t("Welcome to HopeLink Companion")}
            </h2>
            <SiWelcometothejungle className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      )}

      {/* Cookie */}
      <div className="fixed z-50 w-[76vw] md:left-1/2 md:transform md:-translate-x-1/2 bottom-20 md:bottom-16 2xl:w-[60vw]">
        <CookieDialogue />
      </div>
    </div>
  );
}
