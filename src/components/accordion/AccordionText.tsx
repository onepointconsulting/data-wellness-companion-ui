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
    <div className="md:mt-1 md:ml-2 text-gray-900 markdown-body">
      <div className="flex cursor-pointer" onClick={onOpen}>
        <svg
          height="20"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          className="mt-3 mr-2 min-w-5"
        >
          <polygon
            points="1,1 1,19 19,10"
            style={{ fill: "white", stroke: "#6599d4", strokeWidth: 2 }}
            transform={`rotate(${open ? 90 : 0}, 10, 10)`}
            className="accordion-icon"
          />
        </svg>
        <h1>{t(title)}</h1>
      </div>
      <ol
        className={`mb-3 ml-5 space-y-1 text-gray-500 list-decimal gray-color overflow-hidden accordion-body ${open ? "max-h-[1600px]" : "max-h-[0px]"}`}
      >
        {children}
      </ol>
    </div>
  );
}
