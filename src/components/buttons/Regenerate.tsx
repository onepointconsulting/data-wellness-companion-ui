import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import { sendRegenerateMessage } from "../../lib/websocketFunctions.ts";
import { useTranslation } from "react-i18next";
import { MdOutlineReplay } from "react-icons/md";

import { ReportLink } from "./ReportLink.tsx";

export default function Regenerate() {
  const [t] = useTranslation();
  const { sending, setSending, currentMessage, isLast } =
    useContext(AppContext);
  const { socket } = useContext(ChatContext);

  function onRegenerate() {
    setSending(true);
    sendRegenerateMessage(socket.current);
  }

  if (!isLast || currentMessage === 0) {
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
          clazzName="final-report-email !mr-3 mt-3"
        >
          <MdOutlineReplay className="!fill-gray-900 dark:!fill-gray-100" />
        </ReportLink>
      )}
    </div>
  );
}
