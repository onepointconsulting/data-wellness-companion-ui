import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Component used to render a markdown section.
 * @param message T
 * @constructor
 */
export default function MarkdownComponent({ content, className }: { content: string, className: string }) {
  return (
    <Markdown
      className={`markdown-body ${className}`}
      remarkPlugins={[remarkGfm]}
      components={{
        ul: ({ ...props }) => (
          <ul className="ml-5 space-y-3 list-disc" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="mx-4 my-3 space-y-3 list-decimal" {...props} />
        ),
        li: ({ ...props }) => <li className="mt-0" {...props} />,
        p: ({ ...props }) => <p className="pb-4" {...props} />,
        a: ({ children, ...props }) => (
          <a className="pb-4 underline sm:pb-2" {...props} target="_blank">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </Markdown>
  );
}
