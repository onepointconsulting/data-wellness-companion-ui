import { useTranslation } from "react-i18next";

export default function ButtonPanel({
  onClose,
  onOk,
  okText,
  disabled = false,
}: {
  onClose: () => void;
  onOk: () => void;
  okText: string;
  disabled: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="companion-dialogue-buttons">
      <button
        data-close-modal={true}
        onClick={onClose}
        className="button-cancel"
      >
        {t("Close")}
      </button>
      <button
        data-close-modal={true}
        onClick={onOk}
        className="button-ok"
        disabled={disabled}
      >
        {okText}
      </button>
    </div>
  );
}
