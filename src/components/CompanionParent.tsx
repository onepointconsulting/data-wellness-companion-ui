import { useWebsocket } from "../hooks/useWebsocket.ts";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import useConfidence from "../hooks/useConfidence.ts";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import { getClustreSlides } from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import MainApp from "./MainApp.tsx";
import JoyrideContextProvider from "../context/JoyrideContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import useSeenIntro from "../hooks/useSeenIntro.ts";
import useShowCompletionDialogue from "../hooks/useShowCompletionDialogue.ts";
import useGiveMeReportNow from "../hooks/useGiveMeReportNow.ts";
import { IntroSlide } from "./intro/IntroContext.tsx";

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

  useShowCompletionDialogue();

  const { giveMeReportNow } = useGiveMeReportNow();

  function getClustreCompletionSlides(): IntroSlide[] {
    return [
      {
        title: t("Clustre: thank you"),
        subtitle: t("empty"),
        explanation: t("Clustre: intro-thank-you"),
        image: "./tour/slide3.png",
        video: null,
        buttonText: "Generate report",
        buttonOnclick: () => giveMeReportNow(),
      },
    ];
  }

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
        closeFunction={() => setSeenIntro(true)}
        hasCloseButton={true}
      />
      {showCompletionPopup && (
        <IntroSlides
          showIntro={showCompletionPopup}
          imageNode={imageNodeFunc()}
          slides={getClustreCompletionSlides()}
          closeFunction={() => setShowCompletionPopup(false)}
          hasCloseButton={false}
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
