import { AppContext } from "../context/AppContext.tsx";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import ThinkingMsgSpinner from "./ThinkingMsgSpinner.tsx";
import {
  isDisplayReportGenerationMessage,
  useAppStore,
} from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import GiveMeReport from "./buttons/GiveMeReport.tsx";
import { FADE_IN_TIME } from "../lib/animConstants.ts";

const ANALYZING_MESSAGES = [
  "analyzing-1",
  "analyzing-2",
  "analyzing-3",
  "analyzing-4",
  "analyzing-5",
  "analyzing-6",
  "analyzing-7",
];

export default function MainPanel() {
  const [t] = useTranslation();
  const {
    contentVisible,
    setContentVisible,
    currentMessage,
    messages,
    sending,
    isLast,
    regenerating,
  } = useContext(AppContext);
  const {
    expectedNodes,
    generatingReport,
    displayConfidenceLevelProceedWarning,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const [currentAnalyzingMessage, setCurrentAnalyzingMessage] = useState(
    ANALYZING_MESSAGES[0]
  );

  useEffect(() => {
    if (sending) {
      const randomIndex = Math.floor(Math.random() * ANALYZING_MESSAGES.length);
      setCurrentAnalyzingMessage(ANALYZING_MESSAGES[randomIndex]);
    }
  }, [sending]);

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
    regenerating
  );
  const displayChatAreaElements = !sending || !displayReportGenerationMessage;
  const displayConfidenceLevelWarning =
    displayConfidenceLevelProceedWarning && isLast;
  const displayChatRelatedElements =
    displayChatAreaElements && !displayConfidenceLevelWarning;

  function getSpinnerMessage(
    displayReportGenerationMessage: boolean,
    regenerating: boolean
  ) {
    return displayReportGenerationMessage
      ? t("Generating report. This might take 2 to 3 minutes...")
      : regenerating
        ? t("Regenerating")
        : t(currentAnalyzingMessage);
  }

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
          {displayReportGenerationMessage && sending ? (
            <ThinkingMsgSpinner />
          ) : (
            <SpinnerArea
              sending={sending}
              message={getSpinnerMessage(false, regenerating)}
            />
          )}
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
