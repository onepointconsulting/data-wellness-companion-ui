import { Citation } from "../../model/deep-research";
import { useTranslation } from "react-i18next";
import { DeepResearchTitle } from "../dialogue/DeepResearchDialogue";

interface Props {
  citations: Citation[] | undefined;
}

export default function DeepResearchCitations({ citations }: Props) {
  const { t } = useTranslation();
  if (!citations || citations.length === 0) return;

  const groupedCitations = Object.entries(
    citations.reduce(
      (acc, c) => {
        const title = c.title || t("Source");
        if (!acc[title]) acc[title] = new Map();
        const snippet = c.url.includes("text=")
          ? decodeURIComponent(c.url.split("text=")[1]).replace(/,/g, " ")
          : c.text || "";
        if (snippet && !acc[title].has(snippet)) {
          acc[title].set(snippet, c.url);
        }
        return acc;
      },
      {} as Record<string, Map<string, string>>,
    ),
  );

  return (
    <div className="text-sm w-full">
      <DeepResearchTitle title={t("Sources")} />
      <div className="space-y-4">
        {groupedCitations.map(([title, snippets], groupIdx) => (
          <div key={groupIdx}>
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {title}
            </p>
            <ul className="list-none pl-8 space-y-1">
              {Array.from(snippets.entries()).map(([text, url], idx) => (
                <li key={idx} className="text-gray-600 dark:text-gray-400">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700 italic"
                  >
                    "{text}…"
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
