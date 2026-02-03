import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ExpandCollapseButton({
  showAll,
  setShowAll,
}: {
  showAll: boolean;
  setShowAll: (showAll: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        setShowAll(!showAll);
      }}
      className="text-xs font-bold text-primary hover:text-primary/80 transition-colors self-start mt-2 px-3 py-1.5 rounded-full bg-primary/5 hover:bg-primary/10 flex items-center gap-1.5"
    >
      {showAll ? (
        <>
          <ChevronDown className="w-3.5 h-3.5 rotate-180" />
          {t("show-less")}
        </>
      ) : (
        <>
          <ChevronDown className="w-3.5 h-3.5" />
          {t("view-all-extracts")}
        </>
      )}
    </button>
  );
}
