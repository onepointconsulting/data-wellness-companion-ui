import Markdown from "react-markdown";
import { Message } from "../model/message.ts";
import remarkGfm from "remark-gfm";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiGraphLight } from "react-icons/pi";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext.tsx";
import { getSession } from "../lib/sessionFunctions.ts";
import { showDialogue } from "../lib/dialogFunctions.ts";
import { EMAIL_DIALOGUE_ID } from "./dialogue/EmailDialogue.tsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import OntologyGraph, { Ontology } from "./OntologyGraph.tsx";

function showEmailDialogue(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  showDialogue(EMAIL_DIALOGUE_ID);
}

async function fetchOntology(
  sessionId: string,
  reportUrl: string,
): Promise<Ontology> {
  const res = await fetch(`${reportUrl}/ontology/${sessionId}`);
  if (!res.ok) {
    console.error("Network response was not ok " + res.statusText);
    return {
      relationships: [],
      betweenness_centrality: {},
      connected_component_importance_dict: {},
    };
  }
  return await res.json();
}

function ReportLink({
  click,
  clazzName,
  title,
  children,
}: {
  click: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  clazzName: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className={clazzName}>
      <a href="#" onClick={click} title={title}>
        {children}
      </a>
      <a href="#" onClick={click} className="hidden md:block">
        {title}
      </a>
    </div>
  );
}

/**
 * The final report of the conversation.
 * @param message The message with the final report.
 * @constructor
 */
export default function FinalReport({ message }: { message: Message }) {
  const { t } = useTranslation();
  const [ontology, setOntology] = useState<Ontology>({
    relationships: [],
    betweenness_centrality: {},
    connected_component_importance_dict: {},
  });
  const [ontologyOpen, setOntologyOpen] = useState<boolean>(false);
  const { reportUrl } = useContext(ChatContext);
  const sessionId = getSession()?.id;
  const reportPdf = `${reportUrl}/pdf/${sessionId}?language=${i18next?.language}`;

  useEffect(() => {
    if (sessionId && ontologyOpen) {
      fetchOntology(sessionId, reportUrl).then((ontology) => {
        console.log("Ontology", ontology.relationships.length);
        setOntology(ontology);
      });
    }
  }, [sessionId, setOntology, ontologyOpen]);

  return (
    <div className="final-report">
      <OntologyGraph ontology={ontology} ontologyOpen={ontologyOpen} />
      {sessionId && (
        <div className="final-report-download">
          <ReportLink
            click={() => setOntologyOpen(!ontologyOpen)}
            title={t("Knowledge graph")}
            clazzName="final-report-pdf"
          >
            <PiGraphLight />
          </ReportLink>
          <ReportLink
            click={showEmailDialogue}
            title={t("Send report as email")}
            clazzName="final-report-email"
          >
            <MdOutlineAlternateEmail />
          </ReportLink>
          <ReportLink
            click={(_e) => (location.href = reportPdf)}
            title={t("Download PDF")}
            clazzName="final-report-pdf"
          >
            <BsFileEarmarkPdf />
          </ReportLink>
        </div>
      )}
      <Markdown
        className={`mt-1 text-gray-900 markdown-body`}
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ ...props }) => (
            <ul
              className="mb-3 ml-5 space-y-1 text-gray-500 list-disc gray-color"
              {...props}
            />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mx-4 my-3 space-y-3 text-gray-500 list-decimal gray-color"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="mt-0" {...props} />,
          p: ({ ...props }) => <p className="pb-1 font-sans" {...props} />,
          a: ({ children, ...props }) => (
            <a
              className="pb-4 font-sans underline sm:pb-2"
              {...props}
              target="_blank"
            >
              {children}
            </a>
          ),
        }}
      >
        {message.question}
      </Markdown>
    </div>
  );
}
