import { useTranslation } from "react-i18next";

function SpinnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="spinner-layout">{children}</div>;
}

export default function Spinner({ size = 24 }: { size?: number }) {
  const { t } = useTranslation();
  const imageFolder = window.dataWellnessConfig?.imageFolder || "res-ai";

  return (
    <SpinnerLayout>
      <span className="text-sm text-gray-500 mt-3 -mb-4 mx-auto flex flex-col items-center">
        <img
          src={`/${imageFolder}/loader.gif`}
          alt={t("Please wait")}
          title={t("Please wait")}
          className={`h-${size} w-${size}`}
        />
      </span>
    </SpinnerLayout>
  );
}
