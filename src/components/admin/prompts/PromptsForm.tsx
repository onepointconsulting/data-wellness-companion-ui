import { useContext, useEffect, useState } from "react";
import AdminContainer from "../AdminContainer";
import { MessageType } from "../model";
import PromptField from "./PromptField";
import { ChatContext } from "../../../context/ChatContext";

export type PromptNode = {
  id?: number;
  prompt?: string;
  [key: string]: PromptNode | number | string | undefined;
};

export const formatKey = (key: string) => {
  return key
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
};

const renderSection = (obj: PromptNode, path = "") => {
  return Object.entries(obj).map(([key, value]) => {
    const currentPath = path ? `${path}.${key}` : key;

    if (value && typeof value === "object" && "prompt" in value) {
      return (
        <PromptField
          key={currentPath}
          promptKey={key}
          value={value as PromptNode}
          path={currentPath}
        />
      );
    }

    if (value && typeof value === "object") {
      return (
        <div key={currentPath} className="ml-4">
          <h3 className="font-semibold mt-4 mb-2">{key}</h3>
          {renderSection(value as PromptNode, currentPath)}
        </div>
      );
    }

    return null;
  });
};

export default function PromptsForm() {
  const [prompts, setPrompts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { reportUrl } = useContext(ChatContext);

  useEffect(() => {
    fetch(`${reportUrl}/prompts/en?add_ids=true`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("status:", res.status);
        console.log("headers:", [...res.headers.entries()]);
        const text = await res.text();
        console.log("raw body:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("parsed:", data);
        setPrompts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  console.log(prompts);

  return (
    <AdminContainer
      title="Prompts"
      processing={loading}
      message={error ?? undefined}
      messageType={error ? MessageType.FAILURE : undefined}
    >
      {prompts && renderSection(prompts)}
    </AdminContainer>
  );
}
