import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { FileText, ChevronRight, ChevronDown } from "lucide-react";
import { Message, RelevantDocument } from "../../model/message";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Divider from "./Divider";
import ExpandCollapseButton from "./ExpandCollapseButton";

function ExtractContent({ content }: { content: string }) {

  const tryParseJSON = (str: string) => {
    const cleaned = str.replace(/^---json\n?/, "").trim();
    if (
      (cleaned.startsWith("{") && cleaned.endsWith("}")) ||
      (cleaned.startsWith("[") && cleaned.endsWith("]"))
    ) {
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const jsonData = tryParseJSON(content);

  if (jsonData) {
    const renderValue = (val: any): React.ReactNode => {
      if (Array.isArray(val)) {
        return (
          <ul className="ml-4 list-disc space-y-1 mt-1">
            {val.map((item, i) => (
              <li key={i}>{renderValue(item)}</li>
            ))}
          </ul>
        );
      }
      if (typeof val === "object" && val !== null) {
        return (
          <div className="flex flex-col gap-1 ml-2 border-l border-primary/10 pl-2 mt-1">
            {Object.entries(val).map(([k, v]) => (
              <div key={k}>
                <span className="font-bold text-xs uppercase opacity-70">
                  {k.replace(/_/g, " ")}:
                </span>{" "}
                <span className="text-sm">{renderValue(v)}</span>
              </div>
            ))}
          </div>
        );
      }
      return String(val);
    };

    const items = Array.isArray(jsonData) ? jsonData : [jsonData];

    return (
      <div className="flex flex-col gap-4 w-full">
        {items.map((item, i) => (
          <div
            key={i}
            className="p-3 rounded-lg border border-primary/5 bg-primary/[0.02] flex flex-col gap-1.5"
          >
            {typeof item === "object" && item !== null ? (
              Object.entries(item).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary/60">
                    {key.replace(/_/g, " ")}
                  </span>
                  <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                    {renderValue(value)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm">{String(item)}</div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-0 inline-block">{children}</p>,
        ul: ({ ...props }) => (
          <ul className="ml-4 list-disc space-y-1" {...props} />
        ),
        li: ({ ...props }) => <li className="" {...props} />,
      }}
    >
      {content}
    </Markdown>
  );
}

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
            {doc.count > 0 && (
              <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                {t("extracts-found", { count: doc.document_extracts.length })}
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
        <div className="ml-5 mt-1 flex flex-col gap-4 p-4 border-l-2 border-primary/20 bg-transparent animate-fade-down animate-duration-300 overflow-hidden">
          {(doc.document_extracts.length > 1 ||
            (doc.document_extracts[0] &&
              doc.document_extracts[0].length > truncateLimit)) && (
            <ExpandCollapseButton showAll={showAll} setShowAll={setShowAll} />
          )}
          {visibleExtracts.map((extract, idx) => (
            <Fragment key={idx}>
              {visibleExtracts.length > 1 && <Divider idx={idx} total={doc.document_extracts.length} />}
              <div className="text-sm text-foreground/90 leading-relaxed py-1 break-words w-full overflow-hidden">
                <ExtractContent
                  content={showAll ? extract : truncate(extract, truncateLimit)}
                />
              </div>
            </Fragment>
          ))}
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
    <div className="mt-10 mb-4 animate-fade-down animate-duration-500 font-['Manrope']">
      <h2 className="text-lg font-bold !ml-0 mb-3 text-primary dark:text-white flex items-center gap-2">
        <FileText className="w-5 h-5" />
        {t("Relevant Documents")}
      </h2>
      <div className="flex flex-col gap-2">
        {message.relevant_documents.documents.slice(0, 3).map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
