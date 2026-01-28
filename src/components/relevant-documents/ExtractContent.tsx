import JsonRenderer from "./JsonRenderer";
import MarkdownRenderer from "./MarkdownRenderer";

export default function ExtractContent({ content }: { content: string }) {
  const tryParseJSON = (str: string) => {
    const cleaned = str.replace(/^---json\n?/, "").trim();
    if (
      (cleaned.startsWith("{") && cleaned.endsWith("}")) ||
      (cleaned.startsWith("[") && cleaned.endsWith("]"))
    ) {
      try {
        return JSON.parse(cleaned);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const jsonData = tryParseJSON(content);

  if (jsonData) {
    return <JsonRenderer data={jsonData} />;
  }

  return <MarkdownRenderer content={content} />;
}
