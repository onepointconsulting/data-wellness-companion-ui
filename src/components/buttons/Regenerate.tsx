import {useContext} from "react";
import {AppContext} from "../../context/AppContext.tsx";
import {ChatContext} from "../../context/ChatContext.tsx";
import {FaHourglassHalf} from "react-icons/fa";
import {sendRegenerateMessage} from "../../lib/websocketFunctions.ts";
import {useTranslation} from "react-i18next";

export default function Regenerate() {
    const [t] = useTranslation();
    const {sending, setSending, messages, isLast} = useContext(AppContext)
    const {socket} = useContext(ChatContext);

    function onRegenerate() {
        setSending(true)
        sendRegenerateMessage(socket.current)
    }

    if (!isLast && messages.length === 1) {
        return null
    }

    return (
        <>
            {!sending && <div className="question-mark-icon ml-[-11px] mt-[1px]">
                <button onClick={onRegenerate}>
                    <img src="./regenerate.svg" alt={t("Regenerate")}
                         title={t("Regenerate")} className="h-10 w-10"/>
                </button>
            </div>}
            {sending && <div className="question-mark-icon">
                <FaHourglassHalf className="question-mark-icon-svg"/>
            </div>}
        </>
    )
}