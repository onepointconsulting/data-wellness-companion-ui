import { MdOutlineSearch } from "react-icons/md";
import { AccordionText } from "../accordion/AccordionText";
import Markdown from "react-markdown";
import { useTranslation } from "react-i18next";
import { generateDeepResearch } from "../../lib/websocketFunctions.ts";
import { Socket } from "socket.io-client";
import { Fragment, useState, useEffect, useRef, useContext } from "react";
import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import remarkGfm from "remark-gfm";
import { getSession } from "../../lib/sessionFunctions.ts";
import { fetchDeepResearch } from "../../lib/apiCalls.ts";
import {
  DeepResearchOutput,
  DeepResearchOutputMap,
} from "../../model/deep-research.ts";
import { ChatContext } from "../../context/ChatContext.tsx";

function AdviceButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row justify-end mt-0">
      <button onClick={onClick} className="pt-2 btn mt-0">
        <span>
          <MdOutlineSearch className="w-4 h-4 mr-2 dark:text-gray-100" />
        </span>
        <span className="text-sm dark:text-gray-100">{t(label)}</span>
      </button>
    </div>
  );
}

function StatusUpdateMessage({
  statusKey,
  message,
}: {
  statusKey: string;
  message: string;
}) {
  return (
    <div className="flex flex-row justify-end mt-0">
      <span key={statusKey} className="text-sm subtle-blink dark:text-gray-100">
        {message}
      </span>
    </div>
  );
}
export function AdviceList({
  title,
  items,
  defaultOpen = false,
  handleDeepResearch = true,
  socket,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
  handleDeepResearch?: boolean;
  socket?: Socket<any, any> | null;
}) {
  const { t } = useTranslation();
  const sessionId = getSession()?.id;
  const { reportUrl } = useContext(ChatContext);
  const {
    deepResearchStatus,
    deepResearchOutputMap,
    deepResearchStarted,
    completedDeepResearchOutput,
    setDeepResearchStarted,
    setSelectedDeepResearchOutput,
    setDeepResearchOutputMap,
  } = useAppStore(useShallow((state) => ({ ...state })));
  const [statusUpdateKey, setStatusUpdateKey] = useState(0);
  const previousStatusStringRef = useRef<string>("");

  // Track when deepResearchStatus changes (even if status value is the same)
  // This ensures we catch updates from websocket even when status stays "in_progress"
  useEffect(() => {
    const currentStatusString = `${deepResearchStatus.status}-${deepResearchStatus.advice}-${deepResearchStatus.timestamp}`;
    if (previousStatusStringRef.current !== currentStatusString) {
      setStatusUpdateKey((prev: number) => prev + 1);
      previousStatusStringRef.current = currentStatusString;
    }
  }, [
    deepResearchStatus.status,
    deepResearchStatus.advice,
    deepResearchStatus.timestamp,
  ]);

  useEffect(() => {
    if (sessionId) {
      fetchDeepResearch(sessionId, reportUrl)
        .then((deepResearchOutputs) => {
          const deepResearchOutputMap: DeepResearchOutputMap =
            deepResearchOutputs.outputs.reduce(
              (a: DeepResearchOutputMap, e: DeepResearchOutput) => (
                (a[e.advice] = e), a
              ),
              {},
            );
          setDeepResearchOutputMap(deepResearchOutputMap);
        })
        .catch((error) => {
          console.error("Error fetching deep research: " + error);
        });
    }
  }, [sessionId, completedDeepResearchOutput, deepResearchStarted]);

  return (
    <AccordionText
      title={title}
      defaultOpen={defaultOpen}
      openOnHistoricalSession={true}
    >
      {items.map((item, index) => {
        const isCurrentItem = deepResearchStatus.advice === item;
        return (
          <Fragment key={`markdown-accordion-iterable-${index}`}>
            <Markdown
              className={`text-gray-900 markdown-body`}
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({ ...props }) => (
                  <ul className="ml-1 text-[#4a4a4a] list-disc" {...props} />
                ),
                li: ({ ...props }) => <li className="mb-4" {...props} />,
                a: ({ children, ...props }) => (
                  <a
                    className="pb-4 underline sm:pb-2"
                    {...props}
                    target="_blank"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {`- ${item}`}
            </Markdown>
            {handleDeepResearch &&
              socket &&
              !deepResearchStarted &&
              !isCurrentItem &&
              !deepResearchOutputMap[item] && (
                <AdviceButton
                  onClick={() => {
                    generateDeepResearch(socket, item);
                    setDeepResearchStarted(true);
                  }}
                  label="Run Deep Research"
                />
              )}
            {deepResearchOutputMap[item] && (
              <AdviceButton
                onClick={() => {
                  setSelectedDeepResearchOutput(deepResearchOutputMap[item]);
                }}
                label="View Deep Research"
              />
            )}
            {!isCurrentItem &&
              deepResearchStarted &&
              !deepResearchOutputMap[item] && (
                <div className="flex flex-row justify-end mt-0">
                  <span className="text-sm text-gray-500">
                    {t("Please wait...")}
                  </span>
                </div>
              )}
            {isCurrentItem &&
              ["queued", "in_progress"].includes(deepResearchStatus.status) && (
                <StatusUpdateMessage
                  statusKey={`status-${statusUpdateKey}`}
                  message={t("Generating deep research...", {
                    lastUpdated: deepResearchStatus.timestamp
                      ? new Date(
                          deepResearchStatus.timestamp,
                        ).toLocaleTimeString("en-GB")
                      : new Date().toLocaleTimeString("en-GB"),
                  })}
                />
              )}
          </Fragment>
        );
      })}
    </AccordionText>
  );
}

export default AdviceList;
