import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { MdOutlineAlternateEmail } from "react-icons/md";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatContext } from "../context/ChatContext.tsx";
import { showDialogue } from "../lib/dialogFunctions.ts";
import { getSession } from "../lib/sessionFunctions.ts";
import { Message } from "../model/message.ts";
import { EMAIL_DIALOGUE_ID } from "./dialogue/EmailDialogue.tsx";

function showEmailDialogue(e: React.MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  showDialogue(EMAIL_DIALOGUE_ID);
}

/**
 * The final report of the conversation.
 * @param message The message with the final report.
 * @constructor
 */
export default function FinalReport({ message }: { message: Message }) {
  const { reportUrl } = useContext(ChatContext);
  const sessionId = getSession()?.id;
  const reportPdf = `${reportUrl}/pdf/${sessionId}`;
  const { t } = useTranslation();
  const mailSend = t("Send report as email");
  return (
    <div className="final-report">
      {sessionId && (
        <div className="final-report-download">
          <div className="final-report-email">
            <a href="#" onClick={showEmailDialogue} title={mailSend}>
              <MdOutlineAlternateEmail />
            </a>
            <a href="#" onClick={showEmailDialogue}>
              {mailSend}
            </a>
          </div>
          <div className="final-report-pdf">
            <a href={reportPdf} title={t("Download PDF")}>
              <BsFileEarmarkPdf />
            </a>
            <a href={reportPdf}>{t("Download PDF")}</a>
          </div>
        </div>
      )}
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
          p: ({ ...props }) => <p className="pb-1 pl-8 font-sans" {...props} />,
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
        {message.question}
      </Markdown>
    </div>
  );
}
