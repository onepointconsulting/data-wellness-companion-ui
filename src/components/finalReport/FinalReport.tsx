import { Message } from "../../model/message.ts";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { PiGraphLight } from "react-icons/pi";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext.tsx";
import { getSession } from "../../lib/sessionFunctions.ts";
import { showDialogue } from "../../lib/dialogFunctions.ts";
import { EMAIL_DIALOGUE_ID } from "../dialogue/EmailDialogue.tsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import OntologyGraph from "../knowledge-graph/OntologyGraph.tsx";
import { Ontology } from "../../model/ontology.ts";
import { AppContext } from "../../context/AppContext.tsx";
import { toast } from "../../../@/components/ui/use-toast.ts";
import Transcript from "./Transcript.tsx";
import { Confidence } from "../../model/confidence.ts";
import ReportConfidenceLevel from "./ReportConfidenceLevel.tsx";
import MarkdownAccordion from "./MarkdownAccordion.tsx";
import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

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

function extractReasoning(reportData: any): Confidence {
  const confidence = reportData["confidence"];
  return {
    rating: confidence["rating"],
    reasoning: confidence["reasoning"],
  };
}

/**
 * The final report of the conversation.
 * @param message The message with the final report.
 * @constructor
 */
export default function FinalReport({ message }: { message: Message }) {
  const { t } = useTranslation();
  const { setOntology } = useContext(AppContext);
  const { ontologyOpen, setOntologyOpen } = useAppStore(
    useShallow((state) => ({ ...state })),
  );
  const { reportUrl } = useContext(ChatContext);
  const sessionId = getSession()?.id;
  const reportPdf = `${reportUrl}/pdf/${sessionId}?language=${i18next?.language}`;
  const reportData = JSON.parse(message.question);
  const confidence = extractReasoning(reportData);
  const advices = reportData["advices"] as string[];
  const whatToAvoid = reportData["what_you_should_avoid"] as string[];
  const benefits = reportData["positive_outcomes"] as string[];

  useEffect(() => {
    if (sessionId && ontologyOpen) {
      fetchOntology(sessionId, reportUrl)
        .then((ontology) => {
          setOntology(ontology);
        })
        .catch((error) => {
          console.error("Error fetching ontology: " + error);
          toast({
            title: "Failed to fetch knowledge graph",
            description: "Failed to fetch knowledge graph. Try again later",
          });
        });
    }
  }, [sessionId, setOntology, ontologyOpen]);

  const recommendationsTitle = "Suggested courses of action";

  return (
    <div className="final-report">
      
      <MarkdownAccordion
        title={recommendationsTitle}
        items={advices}
        defaultOpen={
          window.localStorage.getItem(`accordion_${recommendationsTitle}`) ===
          null
        }
      />
      <MarkdownAccordion title="What to avoid" items={whatToAvoid} />
      <MarkdownAccordion
        title="Benefits (If you follow the advice)"
        items={benefits}
      />
      <ReportConfidenceLevel confidence={confidence} />
      <Transcript />
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
      <OntologyGraph />
    </div>
  );
}
