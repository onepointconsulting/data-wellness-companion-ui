import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { updatePrompt } from "../../../lib/admin/apiClient";
import { ChatContext } from "../../../context/ChatContext";
import ActionStatus from "../ActionStatus";
import { MessageType } from "../model";

export default function PromptTextArea({
  id,
  initialPrompt,
}: {
  id: number | undefined;
  initialPrompt: string;
}) {
  const [text, setText] = useState<string>(initialPrompt);
  const [status, setStatus] = useState<MessageType | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [t] = useTranslation();

  const { reportUrl } = useContext(ChatContext);

  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleUpdatePrompt = async () => {
    if (id !== undefined) {
      if (!text.trim()) {
        setStatus(MessageType.FAILURE);
        setErrorMessage(t("Prompt cannot be empty"));
        return;
      }
      try {
        const res = await updatePrompt(id, text, reportUrl);
        if (res) {
          setStatus(MessageType.SUCCESS);
        } else {
          setStatus(MessageType.FAILURE);
          setErrorMessage(t("Failed to update prompt"));
        }
      } catch (error) {
        setStatus(MessageType.FAILURE);
        setErrorMessage(
          error instanceof Error ? error.message : t("Failed to update prompt"),
        );
      }
    }
  };

  return (
    <div className="flex flex-col">
      <textarea
        className="w-full p-2 border rounded dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-col justify-between items-start">
        <div className="flex-1 mr-4">
          {status && (
            <ActionStatus
              message={
                status === MessageType.SUCCESS
                  ? t("Prompt updated successfully")
                  : errorMessage
              }
              messageType={status}
            />
          )}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-3 w-28 shrink-0 self-end"
          onClick={handleUpdatePrompt}
        >
          {t("Update Prompt")}
        </button>
      </div>
    </div>
  );
}
