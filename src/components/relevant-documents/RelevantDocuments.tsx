import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Message } from "../../model/message";
import { useTranslation } from "react-i18next";


export default function RelevantDocuments({ message }: { message: Message }) {
    const {
        // contentVisible,
        // sending,
        // isLast,
        // regenerating,
    } = useContext(AppContext);
    const [t] = useTranslation();
    
    if (!message.relevant_documents) return null;
    
    return (
        <div className="mt-3 mb-3">
            <h2 className="text-lg font-bold !ml-0">{t("Relevant Documents")}</h2>
            <ul className="list-none">
                {message.relevant_documents?.documents?.map((relevant_document) => (
                    <li key={relevant_document.id}>
                        {relevant_document.document_name}
                    </li>
                ))}
            </ul>
        </div>
    )
}