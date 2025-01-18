import { useTranslation } from "react-i18next";
import "../../css/admin.css";
import Menu from "./Menu.tsx";
import Spinner from "../Spinner.tsx";
import AdminMessage from "./AdminMessage.tsx";
import { MessageType } from "./model.ts";
import HamburgerMenuContextProvider from "../../context/HamburgerMenuContext.tsx";

export default function AdminContainer({
  title,
  children,
  processing,
  message,
  messageType,
}: {
  title: string;
  children: React.ReactNode;
  processing: boolean;
  message: string | undefined;
  messageType: MessageType | undefined;
}) {
  const [t] = useTranslation();
  return (
    <div className="container mt-1 text-gray-900">
      <HamburgerMenuContextProvider>
        <Menu />
      </HamburgerMenuContextProvider>
      <h1 className="dark:text-gray-100 pt-6">{t(title)}</h1>
      {processing && <Spinner size={12} />}
      {message && <AdminMessage message={message} messageType={messageType} />}
      {children}
    </div>
  );
}
