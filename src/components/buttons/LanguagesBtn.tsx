import "i18next";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import { AppContext } from "../../context/AppContext";
import { languageList } from "../../lib/languageList";

export default function LanguagesBtn() {
  const { languageOpen, setLanguageOpen, setRestartPopOpen, setRestartOpen } =
    useContext(AppContext);
  const { i18n } = useTranslation();

  const handleLanguageClick = () => {
    setRestartPopOpen(false);
    setLanguageOpen(!languageOpen);
    setRestartOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleLanguageClick}
        className="flex flex-col items-center lg:flex-row"
      >
        {/* Icon */}

        {i18n.language === "en-US" ? (
          <MdLanguage className="h-[1.7rem] w-[1.7rem] text-white" />
        ) : (
          <img
            src={languageList.find((lang) => lang.lang === i18n.language)?.flag}
            srcSet={
              languageList.find((lang) => lang.lang === i18n.language)?.flag
            }
            alt="Language flag"
            className="h-[1.7rem] w-[1.7rem] text-white"
          />
        )}
      </button>
    </>
  );
}
