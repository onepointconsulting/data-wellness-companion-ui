import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import Divider from "./Divider";
import ExpandCollapseButton from "./ExpandCollapseButton";
import ExtractContent from "./ExtractContent";
import ClipboardWithIcon from "./ClipboardWithIcon";
import { RelevantDocument } from "../../model/message";

export default function DocumentCard({ doc }: { doc: RelevantDocument }) {
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
    <div className="flex flex-col gap-1 mb-2 font-['Manrope']">
      <div
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setShowAll(false);
        }}
        className={`p-3 rounded-xl border border-border transition-all duration-300 cursor-pointer group flex items-center justify-between shadow-sm hover:shadow-md overflow-hidden ${isOpen ? "bg-accent/5 ring-1 ring-primary/10" : "bg-card"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg transition-colors ${isOpen ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"}`}
          >
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div
              className={`font-bold text-sm transition-colors ${isOpen ? "text-primary" : "text-foreground group-hover:text-primary"}`}
            >
              {doc.document_name}
            </div>
            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
              {doc.document_extracts.length > 0 &&
                t("extracts-found", { count: doc.document_extracts.length })}
            </div>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-primary" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors transform group-hover:translate-x-1 duration-200" />
        )}
      </div>
      {isOpen && doc.document_extracts && doc.document_extracts.length > 0 && (
        <div className="ml-5 mt-1 flex flex-col gap-4 p-4 border-l-2 border-primary/20 bg-transparent animate-fade-down animate-duration-300 overflow-hidden">
          {(doc.document_extracts.length > 1 ||
            (doc.document_extracts[0] &&
              doc.document_extracts[0].length > truncateLimit)) && (
            <ExpandCollapseButton showAll={showAll} setShowAll={setShowAll} />
          )}
          {visibleExtracts.map((extract, idx) => (
            <Fragment key={idx}>
              {visibleExtracts.length > 1 && (
                <Divider idx={idx} total={doc.document_extracts.length} />
              )}
              <div className="relative group/extract flex items-start gap-4">
                <div className="flex-1 text-sm text-foreground/90 leading-relaxed py-1 break-words overflow-hidden">
                  <ExtractContent
                    content={
                      showAll ? extract : truncate(extract, truncateLimit)
                    }
                  />
                </div>
                <div className="shrink-0 mt-1">
                  <ClipboardWithIcon valueToCopy={extract} />
                </div>
              </div>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
