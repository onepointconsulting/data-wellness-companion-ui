import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import { sendRegenerateMessage } from "../../lib/websocketFunctions.ts";
import { useTranslation } from "react-i18next";
import { MdRestartAlt } from "react-icons/md";

import { ReportButton } from "./ReportButton.tsx";

export default function Regenerate() {
  const [t] = useTranslation();
  const {
    sending,
    setSending,
    currentMessage,
    messages,
    isLast,
    setRegenerating,
  } = useContext(AppContext);
  const { socket } = useContext(ChatContext);

  function onRegenerate() {
    setSending((_) => {
      setRegenerating(true);
      return true;
    });
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
    <span className="ml-1 inline-block align-middle">
      {sending && false && (
        <span className="question-mark-icon">
          <FaHourglassHalf className="hour-glass" />
        </span>
      )}
      {!sending && (
        <ReportButton click={onRegenerate}>
          <MdRestartAlt className="w-6 h-6 !fill-[#4a4a4a] dark:!fill-gray-100 align-middle" />
        </ReportButton>
      )}
    </span>
  );
}
