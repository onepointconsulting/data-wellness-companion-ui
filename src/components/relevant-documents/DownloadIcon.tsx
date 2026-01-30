import { useTranslation } from "react-i18next";
import RelevantButton from "./RelevantButton";


export default function DownloadIcon({onClick}: {onClick: (e: React.MouseEvent<HTMLButtonElement>) => void}) {
    const { t } = useTranslation();

    return (
        <div className="relative inline-block group/download">
            <RelevantButton onClick={onClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 15V3M12 15L18 9M12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </RelevantButton>

            {/* Tooltip */}
            <div
                className="absolute bottom-full right-0 mb-2 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700 pointer-events-none transition-opacity duration-300 whitespace-nowrap opacity-0 group-hover/download:opacity-100"
            >
                {t("Download")}
            </div>
        </div>
    );
}