import Markdown from 'react-markdown';
import {Message} from "../model/message.ts";
import remarkGfm from 'remark-gfm';
import { BsFileEarmarkPdf } from "react-icons/bs";
import {useContext} from "react";
import {ChatContext} from "../context/ChatContext.tsx";
import {getSession} from "../lib/sessionFunctions.ts";

/**
 * The final report of the conversation.
 * @param message The message with the final report.
 * @constructor
 */
export default function FinalReport({message}: {message: Message}) {

  const {reportUrl} = useContext(ChatContext)
  const sessionId = getSession()?.id
  const reportPdf = `${reportUrl}/pdf/${sessionId}`
  return (
    <div className="final-report">
      {sessionId && <div className="final-report-download">
        <div className="final-report-pdf">
          <a href={reportPdf} title="Download PDF"><BsFileEarmarkPdf/></a>
          <a href={reportPdf}>Download PDF</a>
        </div>
      </div>}
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
          )
        }}
      >
        {message.question}
      </Markdown>
    </div>
  );
}