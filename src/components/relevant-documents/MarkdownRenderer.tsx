import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-0 inline-block">{children}</p>,
        ul: ({ ...props }) => (
          <ul className="ml-4 list-disc space-y-1" {...props} />
        ),
        li: ({ ...props }) => <li className="" {...props} />,
        pre: ({ children }) => (
          <pre className="whitespace-pre-wrap break-words overflow-visible">
            {children}
          </pre>
        ),
        code: (props) => (
          <code className="whitespace-pre-wrap break-words" {...props} />
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
