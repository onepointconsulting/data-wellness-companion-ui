import { PromptNode, formatKey } from "./PromptsForm";
import PromptTextArea from "./PromptTextArea";

export default function PromptField({
  promptKey,
  value,
  path,
}: {
  promptKey: string;
  value: PromptNode;
  path: string;
}) {
  return (
    <div key={path} className="mb-4">
      <label className="block font-semibold text-sm mb-1 text-gray-700 dark:text-gray-300">
        {formatKey(promptKey)}
      </label>
      <PromptTextArea id={value.id} initialPrompt={value.prompt || ""} />
    </div>
  );
}
