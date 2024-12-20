import { useWebsocket } from "../hooks/useWebsocket.ts";
import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import useConfidence from "../hooks/useConfidence.ts";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import getIntroSlides from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import MainApp from "./MainApp.tsx";
import JoyrideContextProvider from "../context/JoyrideContext.tsx";

export default function CompanionParent() {
  const [t] = useTranslation();
  const { setStartSession, seenIntro, setSeenIntro } = useContext(AppContext);

  useChatHistory();

  useEffect(() => {
    setStartSession(true);
    setSeenIntro(true);
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
      <IntroSlides
        showIntro={!seenIntro}
        setSeenIntro={setSeenIntro}
        imageNode={imageNodeFunc()}
        closeIcon={<IoMdClose className="w-10 h-10 lg:w-16 lg:h-16" />}
        slides={getIntroSlides()}
      />
      {seenIntro && (
        <JoyrideContextProvider>
          <RestartDialogue />
          <EmailDialogue />
          <InfoDialogue />
          <ConfidenceDialogue />
          <MainApp />
        </JoyrideContextProvider>
      )}
    </>
  );
}
