import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

export default function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const [t] = useTranslation();
  return (
    <div className="flex flex-wrap mt-8">
      <div className="w-full md:w-2/12 md:text-right pr-2 md:mt-2 dark:text-gray-100">
        {t(label)}:
      </div>
      <div className="w-full md:w-10/12">{children}</div>
    </div>
  );
}
