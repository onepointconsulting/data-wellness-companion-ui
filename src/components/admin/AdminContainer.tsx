import { useTranslation } from "react-i18next";
import "../../css/admin.css";

export default function AdminContainer({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [t] = useTranslation();
  return (
    <div className="container mt-1 text-gray-900">
      <h1 className="dark:text-gray-100 pt-6">{t(title)}</h1>
      {children}
    </div>
  );
}
