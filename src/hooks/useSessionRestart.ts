import { useTranslation } from "react-i18next";
import { ChangeEvent, useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { ChatContext } from "../context/ChatContext.tsx";
import { toast } from "../../@/components/ui/use-toast.ts";
import restartCompanion from "../lib/restartFunctions.ts";

export default function useSessionRestart({
  func,
}: {
  func: (e: ChangeEvent<HTMLSelectElement>) => void;
}) {
  const { t } = useTranslation();
  const { connected, setChatText, setSelectedHistoricalSession } =
    useContext(AppContext);
  const { socket, reportUrl } = useContext(ChatContext);
  const { messages, setDisplayRegistrationMessage } = useContext(AppContext);

  const restartFunction = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!!value) {
      if (!connected) {
        toast({
          title: t("You are disconnected."),
          description: t(
              "The Data Wellness Companion needs to be connected to change the language.",
          ),
        });
      } else {
        func(e);
        setSelectedHistoricalSession(null);
        restartCompanion(
            messages,
            socket,
            setDisplayRegistrationMessage,
            setChatText,
            reportUrl,
        );
      }
    }
  }
  return { restartFunction };
}
