import { AppContext } from "../context/AppContext.tsx";
import { useContext } from "react";
import Question from "./Question.tsx";
import Suggestions from "./Suggestions.tsx";
import ChatInput from "./ChatInput.tsx";
import QuestionAnswer from "./QuestionAnswer.tsx";
import Spinner from "./Spinner.tsx";
import FinalReport from "./FinalReport.tsx";
import ClarificationArea from "./ClarificationArea.tsx";
import SpinnerArea from "./SpinnerArea.tsx";
import GiveReportNow from "./GiveReportNow.tsx";
import Disclaimer from "./Disclaimer.tsx";

export default function MainPanel() {
  const {
    currentMessage,
    messages,
    sending,
    expectedNodes,
    isLast,
    generatingReport,
  } = useContext(AppContext);
  const message = messages[currentMessage];
  if (!message)
    return (
      <div className="mt-40">
        <Spinner />
      </div>
    );
  const displayReportGenerationMessage =
    currentMessage === expectedNodes - 2 || generatingReport;
  const displayChatAreaElements = !sending || !displayReportGenerationMessage;
  if (!message.final_report) {
    return (
      <>
        <div className="interaction-panel">
          <Question
            message={message}
            currentMessage={currentMessage}
            messagesLength={messages.length}
          />
          {!isLast && <QuestionAnswer message={message} />}
          <SpinnerArea
            sending={sending}
            displayReportGenerationMessage={displayReportGenerationMessage}
          />
          {displayChatAreaElements && (
            <>
              <ClarificationArea />
              {isLast && <ChatInput />}
              <GiveReportNow />
              <Suggestions message={message} />
            </>
          )}
        </div>
        {displayChatAreaElements && <Disclaimer />}
      </>
    );
  } else {
    return <FinalReport message={message} />;
  }
}
