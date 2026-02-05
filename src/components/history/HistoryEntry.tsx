import { useTranslation } from "react-i18next";
import { SessionCompletedData } from "../../model/session";

function timestampAdapter(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  // Format: Monday, 22 Jan 2026 at 04:30 pm
  const localeString = date.toLocaleString(undefined, options);
  const formatted = localeString.replace(/([AP]M)$/, (m) => m.toLowerCase());
  return formatted;
}

function HistoryEntry({
  session,
  isSelected,
  onClick,
}: {
  session: SessionCompletedData;
  isSelected: boolean;
  onClick: (sessionId: string) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onClick(session.session_id)}
      className={`p-3 rounded-lg cursor-pointer border transition-all duration-200 
            ${
              isSelected
                ? "bg-[#F3E5FF] border-[#8F00FF] dark:bg-[#8F00FF]/10 dark:border-[#8F00FF] shadow-sm ring-1 ring-[#8F00FF]/20"
                : "bg-gray-50 border-gray-100 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600 hover:shadow-sm"
            }
          `}
    >
      <div className="text-xs text-gray-400 mb-1">
        {session.created_at && timestampAdapter(new Date(session.created_at))}
      </div>
      <div
        className={`text-sm font-medium ${isSelected ? "text-[#8F00FF] dark:text-[#8F00FF]" : "text-gray-700 dark:text-gray-200"}`}
        title={session.end_advice || ""}
      >
        {session.start_answer || t("New Session")}
      </div>
    </div>
  );
}

export default HistoryEntry;
