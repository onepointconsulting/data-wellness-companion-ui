import { ReactNode, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../context/AppContext";

export function AccordionText({
  title,
  children,
  defaultOpen = false,
  openOnHistoricalSession = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  openOnHistoricalSession?: boolean;
}) {
  const { selectedHistoricalSession } = useContext(AppContext);
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (selectedHistoricalSession && openOnHistoricalSession) {
      setOpen(true);
      return;
    }
    const storageOpen = window.localStorage.getItem(`accordion_${title}`);
    if (storageOpen !== null) {
      const openState = storageOpen === "true";
      setOpen(openState);
    }
  }, [title, selectedHistoricalSession]);

  function onOpen() {
    const openState = !open;
    setOpen(openState);
    window.localStorage.setItem(`accordion_${title}`, `${openState}`);
  }

  return (
    <div className="">
      <div
        className="flex cursor-pointer justify-between items-center p-5 border-b border-[#8F00FF] dark:border-[#F3F4F6]"
        onClick={onOpen}
      >
        <h1>{t(title)}</h1>
        <svg
          height="20"
          width="20"
          viewBox="0 0 451.847 451.847" // Updated viewBox to match the new SVG path
          xmlns="http://www.w3.org/2000/svg"
          className={`text-[#8F00FF] dark:text-[#F3F4F6] transition-transform duration-300 ${
            open ? "rotate-0" : "rotate-180"
          }`} // Using Tailwind for smoother rotation
        >
          <path
            d="M225.923,354.706c-8.098,0-16.195-3.092-22.369-9.263L9.27,151.157c-12.359-12.359-12.359-32.397,0-44.751
       c12.354-12.354,32.388-12.354,44.748,0l171.905,171.915l171.906-171.909c12.359-12.354,32.391-12.354,44.744,0
       c12.365,12.354,12.365,32.392,0,44.751L248.292,345.449C242.115,351.621,234.018,354.706,225.923,354.706z"
            fill="currentColor" // This allows it to use the text-[#8F00FF] color
          />
        </svg>
      </div>
      <ol
        className={`space-y-1 text-black list-decimal gray-color overflow-hidden accordion-body ${open ? "max-h-[1600px]" : "max-h-[0px]"}`}
      >
        {children}
      </ol>
    </div>
  );
}
