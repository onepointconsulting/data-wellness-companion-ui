import { useTranslation } from "react-i18next";

function SpinnerLayout({ children }: { children: React.ReactNode }) {
  return <div className="spinner-layout">{children}</div>;
}

export default function Spinner() {
  const { t } = useTranslation();

  return (
    <SpinnerLayout>
      <span className="text-sm text-gray-500 mt-3 -mb-4 mx-auto">
        <img
          src="./D-Well_Animation_24-06.gif"
          alt={t("Please wait")}
          title={t("Please wait")}
          className="h-24 w-48"
        />
      </span>
    </SpinnerLayout>
  );
}
