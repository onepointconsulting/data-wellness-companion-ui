import onCloseDialogue from "../../lib/dialogFunctions.ts";
import ButtonPanel from "./ButtonPanel.tsx";
import { Input } from "../form/Input.tsx";
import { useContext, useMemo, useState } from "react";
import Spinner from "../Spinner.tsx";
import Alert from "../form/Alert.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { getSession } from "../../lib/sessionFunctions.ts";
import {useTranslation} from "react-i18next";
import i18next from "i18next";

export const EMAIL_DIALOGUE_ID = "email-dialogue";

function onClose() {
  onCloseDialogue(EMAIL_DIALOGUE_ID);
}

/**
 * Dialogue used to capture the email of the user who generated a report.
 * @constructor
 */
export default function EmailDialogue() {
  const { t } = useTranslation();
  const { reportUrl } = useContext(ChatContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const sessionId = getSession()?.id;
  const emailUrl = useMemo(
    () => `${reportUrl}/email/${sessionId}?language=${i18next?.language}`,
    [reportUrl, sessionId],
  );

  async function onOk() {
    setSending(true);
    setFeedbackMessage("");
    try {
      const response = await fetch(emailUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ person_name: name, email }),
      });
      if (response.ok) {
        setFeedbackMessage(t("Email sent. Thank you!"));
      } else {
        setFeedbackMessage(t("Error sending email. Please try again later."));
      }
    } catch (e) {
      setFeedbackMessage(
        t("Error sending email. Fetch failed. Please try again later."),
      );
    } finally {
      setSending(false);
    }
  }

  function disabled(): boolean {
    return !name || !email || sending;
  }

  return (
    <dialog data-model={true} id={EMAIL_DIALOGUE_ID} className="email-dialogue">
      <div className="email-dialogue-content">
        {t("Please enter your name and email address so we can send you the report.")}
      </div>
      <div className="email-dialogue-form">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <label htmlFor="name">{t("Your name:")} </label>
          <Input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <label htmlFor="email">{t("Email")}: </label>
          <Input
            id="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
      </div>
      {sending && <Spinner />}
      {feedbackMessage && (
        <Alert
          feedback={feedbackMessage}
          onClose={() => setFeedbackMessage("")}
        />
      )}
      <ButtonPanel
        onOk={onOk}
        onClose={onClose}
        okText={t("Send email")}
        disabled={disabled()}
      />
    </dialog>
  );
}
