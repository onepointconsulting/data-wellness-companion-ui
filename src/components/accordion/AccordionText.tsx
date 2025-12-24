import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export function AccordionText({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    const storageOpen = window.localStorage.getItem(`accordion_${title}`);
    if (storageOpen !== null) {
      const openState = storageOpen === "true";
      setOpen(openState);
    }
  }, []);

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
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#8F00FF] dark:text-[#F3F4F6]"
        >
          <polygon
            points="1,1 1,19 12,10"
            style={{
              fill: "#a6a6a600",
              stroke: "currentColor",
              strokeWidth: 2,
            }}
            transform={`rotate(${open ? -90 : 90}, 10, 10)`}
            className="accordion-icon"
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
