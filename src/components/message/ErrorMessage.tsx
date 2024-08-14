import {useTranslation} from "react-i18next";

export default function ErrorMessage({error}: {error: string}) {
  const {t} = useTranslation();
  return (
    <div className="text-center text-red-900 dark:text-red-200 font-bold border-2 border-solid border-gray dark:border-gray-100 mt-12 py-4">
      {t("Error")}: {error}
    </div>
  );
}