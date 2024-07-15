import { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { getSession } from "../lib/sessionFunctions.ts";
import { ChatContext } from "../context/ChatContext.tsx";
import i18next from "i18next";

/**
 * Used to fetch confidence every time the messages change.
 */
export default function useConfidence() {
  const { messages, setConfidence, setUpdatingConfidence } =
    useContext(AppContext);
  const { reportUrl } = useContext(ChatContext);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUpdatingConfidence(true);
      fetch(
        `${reportUrl}/confidence/${session.id}?language=${i18next.language}`,
      )
        .then((response) => response.json())
        .then((data) => {
          setConfidence(data);
        })
        .catch((error) => {
          console.error("Error fetching confidence", error);
        })
        .finally(() => {
          setUpdatingConfidence(false);
        });
    }
  }, [messages]);
}
