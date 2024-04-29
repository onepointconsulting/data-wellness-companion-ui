import "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";

function LanguageDropDown({ setToggleLanguage }: { setToggleLanguage: any }) {
  const { i18n, t } = useTranslation();

  const onClickLanguageChange = (e: any) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    setToggleLanguage(false);
  };

  return (
    <div className="absolute w-max h-auto p-2 bg-gray-500 shadow-md rounded-[3px] top-16 flex flex-col gap-8 cursor-auto">
      <span className="text-white">{t("Select language")}</span>
      <div className="absolute w-8 h-8 bg-gray-100 top-12 left-[38%] rotate-[225deg] z-0"></div>
      {/* select */}
      <select
        className="p-2 bg-gray-100 rounded-[2px] border border-gray-400 z-50"
        name="language"
        id="language"
        onChange={onClickLanguageChange}
        value={i18n.language}
      >
        <option value="en">{t("English")}</option>
        <option value="fa">{t("Farsi")}</option>
      </select>
    </div>
  );
}

export default function LanguagesBtn() {
  const [toggleLanguage, setToggleLanguage] = useState<boolean>(false);
  const { t } = useTranslation();

  return (
    <>
      <button
        type="button"
        onClick={() => setToggleLanguage(!toggleLanguage)}
        className="flex flex-col items-center lg:flex-row"
      >
        <MdLanguage className="h-[1.7rem] w-[1.7rem] text-white" />
        <span className="text-white">{t("Language")}</span>
      </button>

      {toggleLanguage && (
        <LanguageDropDown setToggleLanguage={setToggleLanguage} />
      )}
    </>
  );
}
