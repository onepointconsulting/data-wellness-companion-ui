import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, ChevronRight, ChevronDown } from "lucide-react";
import { Message, RelevantDocument } from "../../model/message";

function DocumentCard({ doc }: { doc: RelevantDocument }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const { t } = useTranslation();

  const truncateLimit = 160;
  const truncate = (text: string, length: number) => {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + "...";
  };

  const visibleExtracts = showAll
    ? doc.document_extracts
    : doc.document_extracts.slice(0, 1);

  return (
    <div className="flex flex-col gap-1">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setShowAll(false);
        }}
        className="p-3 rounded-lg border border-border bg-transparent hover:bg-accent/5 transition-all duration-200 cursor-pointer group flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-primary/10 text-primary dark:bg-primary/20">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
              {doc.document_name}
            </div>
            {doc.count > 0 && (
              <div className="text-xs text-muted-foreground uppercase tracking-tight font-medium">
                {t("extracts-found", { count: doc.count })}
              </div>
            )}
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-primary" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-200" />
        )}
      </div>
      {isOpen && doc.document_extracts && doc.document_extracts.length > 0 && (
        <div className="ml-5 mt-1 flex flex-col gap-2 p-3 border-l-2 border-primary/20 bg-transparent animate-fade-down animate-duration-300">
          {visibleExtracts.map((extract, idx) => (
            <div key={idx} className="text-sm text-foreground italic py-1">
              "{showAll ? extract : truncate(extract, truncateLimit)}"
            </div>
          ))}
          {(doc.document_extracts.length > 1 ||
            (doc.document_extracts[0] &&
              doc.document_extracts[0].length > truncateLimit)) && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAll(!showAll);
              }}
              className="text-xs font-semibold text-primary hover:underline self-start mt-2 flex items-center gap-1"
            >
              {showAll ? (
                <>
                  <ChevronDown className="w-3 h-3 rotate-180" />
                  {t("show-less")}
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  {t("view-all-extracts")}
                </>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function RelevantDocuments({ message }: { message: Message }) {
  const [t] = useTranslation();

  if (
    !message.relevant_documents ||
    !message.relevant_documents.documents ||
    message.relevant_documents.documents.length === 0
  )
    return null;

  return (
    <div className="mt-10 mb-4 animate-fade-down animate-duration-500">
      <h2 className="text-lg font-bold !ml-0 mb-3 text-primary dark:text-white flex items-center gap-2">
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
