import { MdOutlineSearch } from "react-icons/md";
import { AccordionText } from "../accordion/AccordionText.tsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useTranslation } from "react-i18next";
import { generateDeepResearch } from "../../lib/websocketFunctions.ts";
import { Socket } from "socket.io-client";
import { Fragment, useState } from "react";
import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

export default function MarkdownAccordion({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
  handleDeepResearch?: boolean;
}) {
  const allItems = items.map((item) => `- ${item}`).join("\n");
  return (
    <AccordionText title={title} defaultOpen={defaultOpen}>
      <Markdown
        className={`text-gray-900 markdown-body`}
        remarkPlugins={[remarkGfm]}
        components={{
          ul: ({ ...props }) => (
            <ul className="ml-1 text-[#4a4a4a] list-disc" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol
              className="mx-4 my-3 space-y-4 text-black list-decimal"
              {...props}
            />
          ),
          li: ({ ...props }) => <li className="mb-4" {...props} />,
          p: ({ ...props }) => <p className="pb-1" {...props} />,
          a: ({ children, ...props }) => (
            <a className="pb-4 underline sm:pb-2" {...props} target="_blank">
              {children}
            </a>
          ),
        }}
      >
        {allItems}
      </Markdown>
    </AccordionText>
  );
}

export function MarkdownAccordionIterable({
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
  const [deepResearchStarted, setDeepResearchStarted] = useState<boolean | null>(false);
  const { deepResearchStatus } = useAppStore(useShallow((state) => ({ ...state })));
  return (
    <AccordionText title={title} defaultOpen={defaultOpen}>
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
                  <a className="pb-4 underline sm:pb-2" {...props} target="_blank">
                    {children}
                  </a>
                ),
              }}
            >
              {`- ${item}`}
            </Markdown>
            {handleDeepResearch && socket && !deepResearchStarted && !isCurrentItem && (
              <div className="flex flex-row justify-end mt-0">
                <button onClick={ () => {
                  generateDeepResearch(socket, item);
                  setDeepResearchStarted(true);
                }} className="pt-2 btn mt-0">
                  <span>
                    <MdOutlineSearch className="w-4 h-4 mr-2 dark:text-gray-100" />
                  </span>
                  <span className="text-sm dark:text-gray-100">{(t("Deep Research"))}</span>
                </button>
              </div>
            )}
            {isCurrentItem && ["queued", "in_progress"].includes(deepResearchStatus.status) && (
              <div className="flex flex-row justify-end mt-0">
                <span className="text-sm text-gray-500">{(t("Generating deep research...", { lastUpdated: new Date().toLocaleString() }))}</span>
              </div>
            )}
          </Fragment>
        )
      })}
    </AccordionText>
  )
}