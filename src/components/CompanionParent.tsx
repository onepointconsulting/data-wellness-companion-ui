import { useWebsocket } from "../hooks/useWebsocket.ts";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import useConfidence from "../hooks/useConfidence.ts";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import {
  getClustreCompletionSlides,
  getClustreSlides,
} from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import MainApp from "./MainApp.tsx";
import JoyrideContextProvider from "../context/JoyrideContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import useSeenIntro from "../hooks/useSeenIntro.ts";
import useShowCompletionPopup from "../hooks/useShowCompletionPopup.ts";

export default function CompanionParent() {
  const [t] = useTranslation();
  const {
    seenIntro,
    setSeenIntro,
    showCompletionPopup,
    setShowCompletionPopup,
  } = useAppStore(
    useShallow((state) => ({
      seenIntro: state.seenIntro,
      setSeenIntro: state.setSeenIntro,
      showCompletionPopup: state.showCompletionPopup,
      setShowCompletionPopup: state.setShowCompletionPopup,
    })),
  );

  useSeenIntro();

  useChatHistory();

  // Establish a websocket connection
  useWebsocket();

  useConfidence();

  useShowCompletionPopup();

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
        imageNode={imageNodeFunc()}
        slides={getClustreSlides()}
        lastButtonText="Clustre: lets-go"
        closeFunction={() => setSeenIntro(true)}
      />
      {showCompletionPopup && (
        <IntroSlides
          showIntro={showCompletionPopup}
          imageNode={imageNodeFunc()}
          slides={getClustreCompletionSlides()}
          lastButtonText="Generate report"
          closeFunction={() => setShowCompletionPopup(false)}
        />
      )}
      {seenIntro && !showCompletionPopup && (
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
