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
import HamburgerMenu from "./menu/HamburgerMenu.tsx";
import useConfidence from "../hooks/useConfidence.ts";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import getIntroSlides from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import HamburgerMenuContextProvider from "../context/HamburgerMenuContext.tsx";
import Joyride from "react-joyride";
import { JoyrideContext } from "../context/JoyrideContext.tsx";

export default function CompanionParent() {
  const [t] = useTranslation();
  const {
    setStartSession,
    displayRegistrationMessage,
    seenIntro,
    setSeenIntro,
  } = useContext(AppContext);

  const { joyrideState, handleJoyrideCallback } = useContext(JoyrideContext);

  const { run, stepIndex, steps } = joyrideState;

  useChatHistory();

  useEffect(() => {
    setStartSession(true);
  }, []);

  // Establish a websocket connection
  useWebsocket();

  useConfidence();

  const imageAlt = t("D-Well logo");

  const imageNodeFunc = () => {
    return <img className="w-52 lg:w-72" src="logo.svg" alt={imageAlt} />;
  };

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        locale={{
          nextLabelWithProgress: "Next ({step} of {steps})",
        }}
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        stepIndex={stepIndex}
        steps={steps}
      />
      <IntroSlides
        showIntro={!seenIntro}
        setSeenIntro={setSeenIntro}
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
          <div className="header">
            <div className="header-container">
              <div className="flex flex-row items-end">{imageNodeFunc()}</div>
              <HamburgerMenuContextProvider>
                <HamburgerMenu />
              </HamburgerMenuContextProvider>
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
      )}
    </>
  );
}
