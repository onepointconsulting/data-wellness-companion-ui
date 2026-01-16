import { useContext, useState } from "react";
import { updatePrompt } from "../../../lib/admin/apiClient";
import { ChatContext } from "../../../context/ChatContext";

export default function PromptTextArea({
  id,
  initialPrompt,
}: {
  id: number | undefined;
  initialPrompt: string;
}) {
  const [text, setText] = useState<string>(initialPrompt);

  const { reportUrl } = useContext(ChatContext);

  const handleUpdatePrompt = async () => {
    if (id !== undefined) {
      const res = await updatePrompt(id, text, reportUrl);
      if (res) {
        alert("Prompt updated in database successfully");
      } else {
        alert("Failed to update prompt in database");
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
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-3 w-28 self-end"
        onClick={handleUpdatePrompt}
      >
        Update Prompt
      </button>
    </div>
  );
}
