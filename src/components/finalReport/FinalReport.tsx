import { Message } from "../../model/message.ts";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineAlternateEmail, MdOutlinePersonSearch } from "react-icons/md";
import { PiGraphLight } from "react-icons/pi";
import { useContext, useEffect } from "react";
import { ChatContext } from "../../context/ChatContext.tsx";
import { getSession } from "../../lib/sessionFunctions.ts";
import { showDialogue } from "../../lib/dialogFunctions.ts";
import { EMAIL_DIALOGUE_ID } from "../dialogue/EmailDialogue.tsx";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import OntologyGraph from "../knowledge-graph/OntologyGraph.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { toast } from "../../../@/components/ui/use-toast.ts";
import Transcript from "./Transcript.tsx";
import { Confidence } from "../../model/confidence.ts";
import ReportConfidenceLevel from "./ReportConfidenceLevel.tsx";
import MarkdownAccordion from "./MarkdownAccordion.tsx";
import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { ReportButton } from "../buttons/ReportButton.tsx";
import { useSuggestConsultant } from "../../hooks/useSuggestConsultant.ts";
import SuggestedConsultants from "../consultants/SuggestedConsultants.tsx";
import useOntology from "../../hooks/useOntology.ts";
import { fetchOntology } from "../../lib/apiCalls.ts";
import AdviceList from "./AdviceList.tsx";

function showEmailDialogue(e: React.MouseEvent<HTMLButtonElement>) {
  e.preventDefault();
  showDialogue(EMAIL_DIALOGUE_ID);
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
  const { onOntologyOpenClick } = useOntology();
  const { ontologyOpen } = useAppStore(useShallow((state) => ({ ...state })));
  const { reportUrl, socket } = useContext(ChatContext);
  const { fetchSuggestedConsultants } = useSuggestConsultant();

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
      <AdviceList
        title={recommendationsTitle}
        items={advices}
        defaultOpen={
          window.localStorage.getItem(`accordion_${recommendationsTitle}`) ===
          null
        }
        socket={socket?.current}
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
          <div className="flex gap-4 justify-center tab-main items-center w-full">
            <ReportButton
              click={onOntologyOpenClick}
              title={t("Knowledge graph")}
            >
              <PiGraphLight />
            </ReportButton>
            <ReportButton
              click={showEmailDialogue}
              title={t("Send report as email")}
            >
              <MdOutlineAlternateEmail />
            </ReportButton>
            <ReportButton
              click={(_e) => (location.href = reportPdf)}
              title={t("Download PDF")}
            >
              <BsFileEarmarkPdf />
            </ReportButton>
            {!window.dataWellnessConfig.hideConsultants && (
              <ReportButton
                click={fetchSuggestedConsultants}
                title={t("Suggest consultants")}
              >
                <MdOutlinePersonSearch />
              </ReportButton>
            )}
            {/* <ReportButton
              click={processPopup()}
              title={t("Explore another area of interest")}
            >
              <MdOutlineReplay />
            </ReportButton> */}
          </div>
        </div>
      )}
      <OntologyGraph />
      <SuggestedConsultants />
    </div>
  );
}
