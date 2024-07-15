import { AppContext } from "../context/AppContext.tsx";
import { useContext } from "react";
import Question from "./Question.tsx";
import Suggestions from "./Suggestions.tsx";
import ChatInput from "./ChatInput.tsx";
import QuestionAnswer from "./QuestionAnswer.tsx";
import Spinner from "./Spinner.tsx";
import FinalReport from "./FinalReport.tsx";
import ExtraFunctionButtons from "./ExtraFunctionButtons.tsx";
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
      <div className="flex flex-col justify-between min-h-screen interaction-panel">
        <div>
          <Question
            message={message}
            currentMessage={currentMessage}
            messagesLength={messages.length}
          />
          <ExtraFunctionButtons />
          <Suggestions message={message} />
          {sending && (
            <div className="mt-6">
              <Spinner />
            </div>
          )}
          {sending && displayReportGenerationMessage && (
            <div className="mt-10 final-report-message">
              {t("Generating final report. This might take 2 to 3 minutes...")}
            </div>
          )}
          {!isLast && <QuestionAnswer message={message} />}
        </div>

        {isLast && <ChatInput />}
      </div>
    );
  } else {
    return <FinalReport message={message} />;
  }
}
