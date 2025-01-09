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
import { getClustreSlides } from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import MainApp from "./MainApp.tsx";
import JoyrideContextProvider from "../context/JoyrideContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { getSeenIntro, hasSeenIntro } from "../lib/sessionFunctions.ts";
import { useShallow } from "zustand/react/shallow";

export default function CompanionParent() {
  const [t] = useTranslation();
  const { setStartSession } = useContext(AppContext);
  const { seenIntro, setSeenIntro } = useAppStore(
    useShallow((state) => ({
      seenIntro: state.seenIntro,
      setSeenIntro: state.setSeenIntro,
    })),
  );

  useEffect(() => {
    if (seenIntro) {
      hasSeenIntro();
    }
  }, [seenIntro]);

  useChatHistory();

  useEffect(() => {
    setStartSession(true);
    setSeenIntro(getSeenIntro());
  }, []);

  // Establish a websocket connection
  useWebsocket();

  useConfidence();

  const imageAlt = t("D-Well logo");

  const imageNodeFunc = () => {
    return (
      <img
        className="w-[75%] md:w-[80%]"
        src="logos/clustre_onepoint.png"
        alt={imageAlt}
      />
    );
  };

  return (
    <>
      <IntroSlides
        showIntro={!seenIntro}
        setSeenIntro={setSeenIntro}
        imageNode={imageNodeFunc()}
        closeIcon={<IoMdClose className="w-10 h-10 lg:w-16 lg:h-16" />}
        slides={getClustreSlides()}
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
