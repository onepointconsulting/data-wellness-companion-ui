import { useState } from "react";
import { getSession } from "../lib/sessionFunctions.ts";
import {
  queryReportEmail,
  ResponseData,
  SUCCESS,
} from "../lib/boomiApi/apiClient.ts";
import { useTranslation } from "react-i18next";

type EmaiReport = {
  sending: boolean;
  feedbackMessage: string;
  setFeedbackMessage: (value: string) => void;
  name: string;
  setName: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  onOk: () => void;
};

export function useEmailReport(): EmaiReport {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  function onOk() {
    setSending(true);
    setFeedbackMessage("");
    const session = getSession();
    if (!!session) {
      queryReportEmail(session.id, name, email)
        .then((response: ResponseData) => {
          if (response.code === SUCCESS) {
            setFeedbackMessage(t("Email sent. Thank you!"));
            return;
          } else {
            setFeedbackMessage(
              t("Error sending email. Please try again later."),
            );
          }
        })
        .catch((error) => {
          console.error("Failed to send email", error);
          setFeedbackMessage(t("Error sending email. Please try again later."));
        })
        .finally(() => {
          setSending(false);
        });
    } else {
      setFeedbackMessage(
        t("Error sending email: no session. Please refresh and try later."),
      );
    }
  }

  return {
    sending,
    feedbackMessage,
    setFeedbackMessage,
    name,
    setName,
    email,
    setEmail,
    onOk,
  };
}
