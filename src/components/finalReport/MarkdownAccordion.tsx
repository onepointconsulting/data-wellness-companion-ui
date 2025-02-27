import { AccordionText } from "../accordion/AccordionText.tsx";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownAccordion({
  title,
  items,
  defaultOpen = false,
}: {
  title: string;
  items: string[];
  defaultOpen?: boolean;
}) {
  const allItems = items.map((item) => `- ${item}`).join("\n");
  return (
    <AccordionText title={title} defaultOpen={defaultOpen}>
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
        {allItems}
      </Markdown>
    </AccordionText>
  );
}
