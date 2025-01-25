import { useTranslation } from "react-i18next";

export default function OnepointInfo() {
  const { t } = useTranslation();
  return (
    <p>
      <a
        href="https://www.onepointltd.com/"
        target="_blank"
        className="default-link"
      >
        {t("Company name")}
      </a>{" "}
      {t(
        "assistant-explanation",
      )}
      <br />
      {t(
        "It will go through a series of questions and then will provide you with a report with recommendations at the end.",
      )}
    </p>
  );
}
