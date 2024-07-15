import { useTranslation } from "react-i18next";

export default function MenuItemTemplate({
  title,
  func,
  children,
}: {
  title: string;
  func: () => void;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="menu-item" onClick={func}>
      <div className="w-12">{children}</div>
      <div className="pt-1 pl-2">
        <button>{t(title)}</button>
      </div>
    </div>
  );
}
