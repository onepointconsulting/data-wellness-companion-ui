import {AppContext} from "../context/AppContext.tsx";
import {useContext} from "react";
import Question from "./Question.tsx";
import Suggestions from "./Suggestions.tsx";
import ChatInput from "./ChatInput.tsx";
import QuestionAnswer from "./QuestionAnswer.tsx";
import FinalReport from "./FinalReport.tsx";
import ClarificationArea from "./ClarificationArea.tsx";
import SpinnerArea from "./SpinnerArea.tsx";
import GiveReportNow from "./GiveReportNow.tsx";

export default function MainPanel() {
  const {
    currentMessage,
    messages,
    sending,
    expectedNodes,
    isLast,
    generatingReport,
    errorMessage
  } = useContext(AppContext);
  const message = messages[currentMessage];
  if (!message) {
    return (
      <SpinnerArea
        sending={sending}
        displayReportGenerationMessage={false}
        errorMessage={errorMessage}
      />
    );
  }
  const displayReportGenerationMessage =
    currentMessage === expectedNodes - 2 || generatingReport;
  if (!message.final_report) {
    return (
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
          errorMessage={errorMessage}
        />
        <ClarificationArea />
        {isLast && <ChatInput />}
        <GiveReportNow />
        <Suggestions message={message} />
      </div>
    );
  } else {
    return <FinalReport message={message} />;
  }
}
