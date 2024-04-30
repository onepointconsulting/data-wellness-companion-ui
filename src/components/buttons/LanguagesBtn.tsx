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
    <div className="absolute w-max h-auto p-2 bg-white shadow-2xl rounded-[5px] top-16 flex flex-col gap-8 cursor-auto">
      <span className="text-gray-600">{t("Select language")}</span>
      <div className="absolute w-8 h-8 bg-[#0084d7] top-12 left-[38%] rotate-[225deg] z-0"></div>
      {/* select */}
      <select
        className="p-2 bg-[#0084d7] rounded-[2px] z-50 text-white"
        name="language"
        id="language"
        onChange={onClickLanguageChange}
        value={i18n.language}
      >
        <option className="text-white" value="en">
          {t("English")}
        </option>
        <option className="text-white" value="fa">
          {t("Farsi")}
        </option>
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
