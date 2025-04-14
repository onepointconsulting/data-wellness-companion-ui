import { AppContext } from "../context/AppContext.tsx";
import { useContext, useEffect } from "react";
import Question from "./Question.tsx";
import Suggestions from "./Suggestions.tsx";
import ChatInput from "./ChatInput.tsx";
import QuestionAnswer from "./QuestionAnswer.tsx";
import Spinner from "./Spinner.tsx";
import FinalReport from "./finalReport/FinalReport.tsx";
import ClarificationArea from "./ClarificationArea.tsx";
import SpinnerArea from "./SpinnerArea.tsx";
import Disclaimer from "./Disclaimer.tsx";
import ConfidenceLevelWarning from "./ConfidenceLevelWarning.tsx";
import {
  isDisplayReportGenerationMessage,
  useAppStore,
} from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import GiveMeReport from "./buttons/GiveMeReport.tsx";
import { FADE_IN_TIME } from "../lib/animConstants.ts";

export default function MainPanel() {
  const {
    contentVisible,
    setContentVisible,
    currentMessage,
    messages,
    sending,
    isLast,
  } = useContext(AppContext);
  const {
    expectedNodes,
    generatingReport,
    displayConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));

  useEffect(() => {
    const timeout = setTimeout(() => setContentVisible(true), FADE_IN_TIME);
    return () => clearTimeout(timeout);
  }, [contentVisible]);

  const message = messages[currentMessage];
  if (!message)
    return (
      <div className="mt-40">
        <Spinner />
      </div>
    );
  const displayReportGenerationMessage = isDisplayReportGenerationMessage(
    currentMessage,
    expectedNodes,
    generatingReport,
  );
  const displayChatAreaElements = !sending || !displayReportGenerationMessage;
  const displayConfidenceLevelWarning =
    displayConfidenceLevelProceedWarning && isLast;
  const displayChatRelatedElements =
    displayChatAreaElements && !displayConfidenceLevelWarning;
  if (!message.final_report) {
    return (
      <>
        <div
          className={`interaction-panel transition-opacity duration-300 ease-in-out ${contentVisible ? "opacity-100" : "opacity-0"}`}
        >
          {displayChatRelatedElements && (
            <Question
              message={message}
              currentMessage={currentMessage}
              messagesLength={messages.length}
            />
          )}
          {!isLast && <QuestionAnswer message={message} />}
          <SpinnerArea
            sending={sending}
            displayReportGenerationMessage={displayReportGenerationMessage}
          />
          {displayChatRelatedElements && (
            <>
              <ClarificationArea />
              {isLast && <ChatInput />}
              <GiveMeReport />
              <Suggestions message={message} />
            </>
          )}
          {displayConfidenceLevelWarning && <ConfidenceLevelWarning />}
        </div>
        {displayChatRelatedElements && <Disclaimer />}
      </>
    );
  } else {
    return <FinalReport message={message} />;
  }
}
