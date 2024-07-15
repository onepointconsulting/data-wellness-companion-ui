import { useTranslation } from "react-i18next";

export default function OnepointInfo() {
  const { t } = useTranslation();
  return (
    <p>
      <a href="#" target="_blank" className="default-link">
        {t("Company name")}
      </a>{" "}
      {t(
        "is designed to be your helpful assistant, providing support and guidance to refugees",
      )}
      <br />
      {t(
        "It will go through a series of questions and then will provide you with a report with recommendations at the end.",
      )}
    </p>
  );
}
