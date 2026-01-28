import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ClipboardWithIconProps {
  valueToCopy: string;
}

export default function ClipboardWithIcon({
  valueToCopy,
}: ClipboardWithIconProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(valueToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative inline-block group/clipboard">
      <button
        onClick={handleCopy}
        className="flex items-center justify-center w-8 h-8 text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-[#8F00FF] dark:bg-gray-800 dark:text-[#fafffe] dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none transition-all duration-200"
      >
        {copied ? (
          <Check className="w-4 h-4 text-[#8F00FF] dark:text-[#fafffe]" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </button>

      {/* Tooltip */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 pointer-events-none transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0 group-hover/clipboard:opacity-100"}`}
      >
        {copied ? "Copied!" : "Copy to clipboard"}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
      </div>
    </div>
  );
}
