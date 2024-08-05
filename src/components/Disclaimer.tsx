import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";

export default function Disclaimer() {
  const { connected, displayRegistrationMessage, messages } =
    useContext(AppContext);
  const { t } = useTranslation();
  if (!connected || displayRegistrationMessage || !messages.length) return null;

  return (
    <div className="flex flex-row justify-center mt-8 text-gray-500 align-middle disclaimer text-normal dark:text-gray-100">
      <p>{t("disclaimer")}.</p>
    </div>
  );
}
