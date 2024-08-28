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
import HamburgerMenu from "./menu/HamburgerMenu.tsx";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import getIntroSlides from "../intro/slides.tsx";
import useSessionInit from "../hooks/useSessionInit.ts";
import NodeNavigation from "./NodeNavigation.tsx";
import ConfidenceHint from "./buttons/ConfidenceHint.tsx";
import useConfidenceHint from "../hooks/useConfidenceHint.ts";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";

export default function CompanionParent() {
  const [t] = useTranslation();
  const { setStartSession, displayRegistrationMessage, seenIntro } =
    useContext(AppContext);
  useSessionInit();
  useChatHistory();
  const {missingConfidence} = useConfidenceHint()

  // Update the state of the session to start
  useEffect(() => {
    setStartSession(true);
  }, []);

  const imageAlt = t("D-Well logo");

  const imageNodeFunc = () => {
    return <img className="w-52 lg:w-72" src="logo.svg" alt={imageAlt} />;
  };

  return (
    <>
      <IntroSlides
        showIntro={!seenIntro}
        imageNode={imageNodeFunc()}
        closeIcon={<IoMdClose className="w-10 h-10 lg:w-16 lg:h-16" />}
        slides={getIntroSlides()}
      />
      {seenIntro && (
        <>
          <RestartDialogue />
          <EmailDialogue />
          <InfoDialogue />
          <ConfidenceDialogue />
          {/*<IntroDialogue />*/}
          <div className="header">
            <div className="header-container">
              <div className="flex flex-row items-end">{imageNodeFunc()}</div>
              <HamburgerMenu />
            </div>
          </div>
          <div className={`container ${missingConfidence ? '' : 'px-4'}`}>
            <div className="flex flex-row gap-8">
              <div className="w-full">
                {displayRegistrationMessage && <RegistrationMessage />}
                {!displayRegistrationMessage && <MainPanel />}
                <Disclaimer />
              </div>
              <div>
                <ConfidenceHint className="mb-2"/>
                <NodeNavigation />
              </div>
            </div>
          </div>
          <Toaster />
        </>
      )}
    </>
  );
}
