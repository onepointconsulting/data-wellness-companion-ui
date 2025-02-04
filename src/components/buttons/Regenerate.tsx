import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import { sendRegenerateMessage } from "../../lib/websocketFunctions.ts";
import { useTranslation } from "react-i18next";
import { MdRestartAlt } from "react-icons/md";

import { ReportLink } from "./ReportLink.tsx";

export default function Regenerate() {
  const [t] = useTranslation();
  const { sending, setSending, currentMessage, messages, isLast } =
    useContext(AppContext);
  const { socket } = useContext(ChatContext);

  function onRegenerate() {
    setSending(true);
    sendRegenerateMessage(socket.current);
  }

  if (
    !isLast ||
    currentMessage === 0 ||
    messages[currentMessage]?.question_id
  ) {
    return null;
  }

  return (
    <div className="flex items-start justify-end">
      {sending && false && (
        <div className="question-mark-icon">
          <FaHourglassHalf className="hour-glass" />
        </div>
      )}
      {!sending && (
        <ReportLink
          click={onRegenerate}
          title={t("Regenerate")}
          clazzName="final-report-email mt-3"
        >
          <MdRestartAlt className="!fill-[#4a4a4a] dark:!fill-gray-100" />
        </ReportLink>
      )}
    </div>
  );
}
