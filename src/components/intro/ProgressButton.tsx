import { useTranslation } from "react-i18next";

export default function ProgressButton({
  handlerFunc,
  translationKey,
  imgPath,
  disabled,
}: {
  handlerFunc: () => void;
  translationKey: string;
  imgPath: string;
  disabled: boolean;
}) {
  const [t] = useTranslation();
  const title = t(translationKey);
  return (
    <button
      onClick={handlerFunc}
      disabled={disabled}
      className="disabled:opacity-40 dark:brightness-200"
    >
      <img src={imgPath} alt={title} title={title} className="h-12" />
    </button>
  );
}
