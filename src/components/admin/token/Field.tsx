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
    <div className="flex flex-wrap mt-4">
      <div className="w-full pr-2 md:my-2 dark:text-gray-100">
        {t(label)}:
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
}
