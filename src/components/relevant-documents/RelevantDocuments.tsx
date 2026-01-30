import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";
import { Message } from "../../model/message";

import DocumentCard from "./DocumentCard";

export default function RelevantDocuments({ message }: { message: Message }) {
  const [t] = useTranslation();

  if (
    !message.relevant_documents ||
    !message.relevant_documents.documents ||
    message.relevant_documents.documents.length === 0
  )
    return null;

  return (
    <div className="mt-6 md:mt-6 mb-4 md:mx-0 animate-fade-down animate-duration-500 font-['Manrope']">
      <h2 className="text-lg font-bold !ml-0 mb-3 text-primary dark:text-white flex items-center gap-2 px-1 md:px-0">
        <FileText className="w-5 h-5" />
        {t("Relevant Documents")}
      </h2>
      <div className="flex flex-col gap-2">
        {message.relevant_documents.documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
