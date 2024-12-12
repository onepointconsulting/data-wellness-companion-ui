import { useContext } from "react";
import { Trans } from "react-i18next";
import { AppContext } from "../context/AppContext.tsx";

export default function Disclaimer() {
  const { connected, displayRegistrationMessage, messages } =
    useContext(AppContext);
  if (!connected || displayRegistrationMessage || !messages.length) return null;

  return (
    <div className="flex flex-row justify-center text-gray-500 align-middle disclaimer text-normal dark:text-gray-100">
      <p>
        <Trans
          key="disclaimer"
          i18nKey="disclaimer"
          components={{ anchor: <a />, bold: <strong />, underline: <u /> }}
        />
      </p>
    </div>
  );
}
