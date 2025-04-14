import { useWebsocket } from "../hooks/useWebsocket.ts";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import useConfidence from "../hooks/useConfidence.ts";
import { IntroSlides } from "./intro/IntroSlides.tsx";
import { useTranslation } from "react-i18next";
import { getCompletionSlides, getIntroSlides } from "../intro/slides.tsx";
import ConfidenceDialogue from "./dialogue/ConfidenceDialogue.tsx";
import MainApp from "./MainApp.tsx";
import JoyrideContextProvider from "../context/JoyrideContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import useSeenIntro from "../hooks/useSeenIntro.ts";
import useShowCompletionDialogue from "../hooks/useShowCompletionDialogue.ts";
import useGiveMeReportNow from "../hooks/useGiveMeReportNow.ts";
import { logoAdapter } from "../lib/logoAdapter.ts";

const COMPLETION_POPUP = false;

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

  const imageAlt = t("logo-alt");

  const imageNodeFunc = () => {
    return <img className="w-96" src={logoAdapter()} alt={imageAlt} />;
  };

  const completionPopup = showCompletionPopup && COMPLETION_POPUP;

  return (
    <>
      <IntroSlides
        showIntro={!seenIntro}
        imageNode={imageNodeFunc()}
        slides={getIntroSlides()}
        closeFunction={() => setSeenIntro(true)}
        hasCloseButton={true}
      />
      {completionPopup && (
        <IntroSlides
          showIntro={showCompletionPopup}
          imageNode={imageNodeFunc()}
          slides={getCompletionSlides(giveMeReportNow)}
          closeFunction={() => setShowCompletionPopup(false)}
          hasCloseButton={false}
        />
      )}
      {seenIntro && !completionPopup && (
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
