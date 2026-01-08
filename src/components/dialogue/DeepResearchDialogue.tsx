import { useTranslation } from "react-i18next";
import onCloseDialogue, { showDialogue } from "../../lib/dialogFunctions";
import DialogueHeader from "./DialogueHeader";
import GenericDialogue from "./GenericDialogue";
import { useAppStore } from "../../context/AppStore";
import { useShallow } from "zustand/react/shallow";
import DialogueBody from "./DialogueBody";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const DEEP_RESEARCH_DIALOGUE_ID = "deep-research-dialogue";

export function showDeepResearchDialogue(
  event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
) {
  event.preventDefault();
  onCloseDialogue(DEEP_RESEARCH_DIALOGUE_ID);
  showDialogue(DEEP_RESEARCH_DIALOGUE_ID);
}

function DeepResearchTitle({ title }: { title: string }) {
  return <h1 className="text-right mt-4 mb-3">{title}</h1>;
}

export default function DeepResearchDialogue() {
  const { t } = useTranslation();
  const { selectedDeepResearchOutput, setSelectedDeepResearchOutput } =
    useAppStore(useShallow((state) => ({ ...state })));
  return (
    <GenericDialogue
      dialogueId={DEEP_RESEARCH_DIALOGUE_ID}
      clazz="deep-research-dialogue"
      contentClassName="deep-research-dialogue-content"
    >
      <DialogueHeader
        onClose={() => {
          setSelectedDeepResearchOutput(null);
        }}
        className="!pl-3 !pr-0 !pt-0"
      >
        <div className="text-lg font-bold text-[#4a4a4a] dark:text-gray-100">
          {t("Deep Research")}
        </div>
      </DialogueHeader>
      <DialogueBody>
        <div className="text-md markdown-body">
          <DeepResearchTitle title={t("Advice")} />
          <Markdown
            className={`text-md markdown-body`}
            remarkPlugins={[remarkGfm]}
            components={{
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
            {selectedDeepResearchOutput?.advice}
          </Markdown>
          <DeepResearchTitle title={t("Deep Research")} />
          <Markdown
            className={`text-base markdown-body`}
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ children, ...props }) => (
                <a
                  className="pb-4 underline sm:pb-2"
                  {...props}
                  target="_blank"
                >
                  {children}
                </a>
              ),
              h2: ({ children, ...props }) => (
                <h2 className="dark:text-gray-100" {...props}>
                  {children}
                </h2>
              ),
              p: ({ children, ...props }) => (
                <p className="text-base dark:text-gray-100" {...props}>
                  {children}
                </p>
              ),
            }}
          >
            {selectedDeepResearchOutput?.deep_research_output}
          </Markdown>
        </div>
        {selectedDeepResearchOutput?.citations &&
          selectedDeepResearchOutput.citations.length > 0 && (
            <div className="mt-8 border-t pt-4 text-sm">
              <h3 className="font-bold mb-4">{t("Sources")}</h3>
              <div className="space-y-4">
                {Object.entries(
                  selectedDeepResearchOutput.citations.reduce(
                    (acc, c) => {
                      const title = c.title || t("Source");
                      if (!acc[title]) acc[title] = new Map();
                      const snippet = c.url.includes("text=")
                        ? decodeURIComponent(c.url.split("text=")[1]).replace(
                            /,/g,
                            " "
                          )
                        : c.text || "";
                      if (snippet && !acc[title].has(snippet)) {
                        acc[title].set(snippet, c.url);
                      }
                      return acc;
                    },
                    {} as Record<string, Map<string, string>>
                  )
                ).map(([title, snippets], groupIdx) => (
                  <div key={groupIdx}>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      {title}
                    </p>
                    <ul className="list-decimal pl-8 space-y-1">
                      {Array.from(snippets.entries()).map(
                        ([text, url], idx) => (
                          <li
                            key={idx}
                            className="text-gray-600 dark:text-gray-400"
                          >
                            {text} ...{" "}
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline hover:text-blue-700"
                            >
                              (link)
                            </a>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
      </DialogueBody>
    </GenericDialogue>
  );
}
