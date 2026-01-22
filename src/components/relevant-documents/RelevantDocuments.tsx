import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Message } from "../../model/message";


export default function RelevantDocuments() {
    const {
        // contentVisible,
        currentMessage,
        messages,
        // sending,
        // isLast,
        // regenerating,
    } = useContext(AppContext);
    const message: Message = messages[currentMessage];
    if (!message.documents) return null;
    return null
}