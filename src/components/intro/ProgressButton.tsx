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
  return (
    <button onClick={handlerFunc} disabled={disabled}>
      <img src={imgPath} alt={t(translationKey)} className="h-12" />
    </button>
  );
}
