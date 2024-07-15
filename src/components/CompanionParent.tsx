import NodeNavigation from "./NodeNavigation.tsx";
import { useWebsocket } from "../hooks/useWebsocket.ts";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";
import InteractionPanel from "./InteractionPanel.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import Disclaimer from "./Disclaimer.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import { Toaster } from "../../@/components/ui/toaster";
import IntroDialogue from "./dialogue/IntroDialogue.tsx";
import HamburgerMenu from "./menu/HamburgerMenu.tsx";
import useConfidence from "../hooks/useConfidence.ts";

// function ConnectionStatus() {
//   const { t } = useTranslation();
//   const { connected } = useContext(AppContext);
//
//   return (
//     <div className="connection-status">
//       {connected ? (
//         <PiPlugsConnected className="info-button" title={t("connected")} />
//       ) : (
//         <TbPlugConnected className="info-button" title={t("disconnected")} />
//       )}
//     </div>
//   );
// }

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

  useConfidence();

  return (
    <>
      <RestartDialogue />
      <EmailDialogue />
      <InfoDialogue />
      <IntroDialogue />
      <div className="header">
        <div className="header-container">
          <div className="flex flex-row items-end">
            <img className="w-48" src="logo.png" alt="D-Well logo" />
            <span className="experimental dark:text-gray-100 dark:bg-gray-500">
              {t("Experimental")}
            </span>
          </div>
          <HamburgerMenu />
        </div>
      </div>

      <div className="container">
        {/* Confidence level */}
        <div className="grid grid-cols-10">
          <div className="col-span-3 rounded-sm dark:bg-slate-700 bg-slate-200 animate-fade-down animate-ease-in h-screen 2xl:h-[45rem] overflow-auto">
            {" "}
            <ConfidenceDialogue />
          </div>

          <div className="w-full col-span-6 ml-3">
            {displayRegistrationMessage && <RegistrationMessage />}
            {!displayRegistrationMessage && <InteractionPanel />}
            <Disclaimer />
          </div>

          <div className="col-span-1">
            <NodeNavigation />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
