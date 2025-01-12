import { AppContext } from "../context/AppContext.tsx";
import { useContext } from "react";
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
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

export default function MainPanel() {
  const { currentMessage, messages, sending, expectedNodes, isLast } =
    useContext(AppContext);
  const { generatingReport, displayConfidenceLevelProceedWarning } =
    useAppStore(useShallow((state) => ({ ...state })));
  const message = messages[currentMessage];
  if (!message)
    return (
      <div className="mt-40">
        <Spinner />
      </div>
    );
  const displayReportGenerationMessage =
    currentMessage === expectedNodes - 1 || generatingReport;
  const displayChatAreaElements = !sending || !displayReportGenerationMessage;
  const displayConfidenceLevelWarning =
    displayConfidenceLevelProceedWarning && isLast;
  const displayChatRelatedElements =
    displayChatAreaElements && !displayConfidenceLevelWarning;
  if (!message.final_report) {
    return (
      <>
        <div className="interaction-panel">
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
