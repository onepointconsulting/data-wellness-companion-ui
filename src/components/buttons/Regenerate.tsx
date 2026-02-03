import { useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { FaHourglassHalf } from "react-icons/fa";
import { sendRegenerateMessage } from "../../lib/websocketFunctions.ts";
import { MdRestartAlt } from "react-icons/md";

export default function Regenerate() {
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
        <button
          onClick={onRegenerate}
          className="text-base flex flex-row items-center justify-center rounded-md transition-all duration-300 ease-in-out hover:scale-110 group"
        >
          <MdRestartAlt className="w-6 h-6 fill-[#4a4a4a] dark:fill-gray-100 align-middle transition-colors duration-300 group-hover:fill-[#8F00FF]" />
        </button>
      )}
    </span>
  );
}
