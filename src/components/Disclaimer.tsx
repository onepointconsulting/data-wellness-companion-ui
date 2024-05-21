import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";

export default function Disclaimer() {
  const { connected, displayRegistrationMessage, messages } =
    useContext(AppContext);
  if (!connected || displayRegistrationMessage || !messages.length) return null;

  const { t } = useTranslation();

  return (
    <div className="flex flex-row justify-center text-gray-500 align-middle disclaimer text-normal">
      <p>
        {t(
          "This companion can make mistakes. Consider checking important information",
        )}
        .
      </p>
    </div>
  );
}
