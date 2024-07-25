import { AppContext } from "../context/AppContext.tsx";
import { useContext } from "react";
import Question from "./Question.tsx";
import Suggestions from "./Suggestions.tsx";
import ChatInput from "./ChatInput.tsx";
import QuestionAnswer from "./QuestionAnswer.tsx";
import Spinner from "./Spinner.tsx";
import FinalReport from "./FinalReport.tsx";
import ClarificationArea from "./ClarificationArea.tsx";
import { useTranslation } from "react-i18next";

export default function InteractionPanel() {
  const [t] = useTranslation();
  const { currentMessage, messages, sending, expectedNodes, isLast } =
    useContext(AppContext);
  const message = messages[currentMessage];
  if (!message)
    return (
      <div className="mt-40">
        <Spinner />
      </div>
    );
  const displayReportGenerationMessage = currentMessage === expectedNodes - 2;
  if (!message.final_report) {
    return (
      <div className="interaction-panel">
        <Question
          message={message}
          currentMessage={currentMessage}
          messagesLength={messages.length}
        />
        {sending && (
          <>
            <div className="mt-6 mb-8">
              <Spinner />
            </div>
            {displayReportGenerationMessage && (
              <div className="final-report-message mt-10 mb-2">
                {t(
                  "Generating final report. This might take 2 to 3 minutes...",
                )}
              </div>
            )}
          </>
        )}
        <ClarificationArea />
        {isLast && <ChatInput />}
        <Suggestions message={message} />
        {!isLast && <QuestionAnswer message={message} />}
      </div>
    );
  } else {
    return <FinalReport message={message} />;
  }
}
