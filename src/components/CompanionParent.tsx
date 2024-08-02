import NodeNavigation from "./NodeNavigation.tsx";
import { useWebsocket } from "../hooks/useWebsocket.ts";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import MainPanel from "./MainPanel.tsx";
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
            <img className="w-48" src="logo.svg" alt="D-Well logo" />
          </div>
          <HamburgerMenu />
        </div>
      </div>
      <div className="container">
        <div className="flex flex-row gap-8">
          <div className="w-full">
            {displayRegistrationMessage && <RegistrationMessage />}
            {!displayRegistrationMessage && <MainPanel />}
            <Disclaimer />
          </div>
          <div>
            <NodeNavigation />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
