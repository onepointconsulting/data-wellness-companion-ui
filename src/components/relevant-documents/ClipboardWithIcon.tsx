import { useState } from "react";
import { Copy, Check } from "lucide-react";
import RelevantButton from "./RelevantButton";


export default function ClipboardWithIcon({
  valueToCopy,
}: {
  valueToCopy: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block group/clipboard">
      <RelevantButton onClick={handleCopy}>
        {copied ? (
          <Check className="w-4 h-4 text-[#8F00FF] dark:text-[#fafffe]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </RelevantButton>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 pointer-events-none transition-opacity duration-300 whitespace-nowrap ${copied ? "opacity-100" : "opacity-0 group-hover/clipboard:opacity-100"}`}
      >
        {copied ? "Copied!" : "Copy to clipboard"}
        <div className="absolute top-full right-3 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
}
