import {useContext} from "react";
import {AppContext} from "../../context/AppContext.tsx";
import {useTranslation} from "react-i18next";


export default function Transcript() {
    const { t } = useTranslation();
    const { messages } = useContext(AppContext);
    return (
        <div className="mt-1 text-gray-900 markdown-body">
            <h1>{t("Transcript")}</h1>
            <ol className="mb-3 ml-5 space-y-1 text-gray-500 list-decimal gray-color">
            {messages.filter(message => !message.final_report).map((message, i) => (
                <li key={`qa_${i}`}>
                    <p className="italic">{message.question}</p>
                    <p>{message.answer}</p>
                </li>
            ))}
            </ol>
        </div>
    )
}