import "i18next";
import { useCallback, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import restartCompanion from "../../lib/restartFunctions.ts";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import { toast } from "../../../@/components/ui/use-toast.ts";

function LanguageDropDown({
  setToggleLanguage,
}: {
  setToggleLanguage: (b: boolean) => void;
}) {
  const { i18n, t } = useTranslation();
  const { connected, setChatText, setSelectedHistoricalSession } =
    useContext(AppContext);
  const { socket, reportUrl } = useContext(ChatContext);
  const { messages, setDisplayRegistrationMessage } = useContext(AppContext);

  const onClickLanguageChange = (e: any) => {
    if (!connected) {
      toast({
        title: t("You are disconnected."),
        description: t(
          "The Data Wellness Companion needs to be connected to change the language.",
        ),
      });
    } else {
      const language = e.target.value;
      i18n.changeLanguage(language);
      setToggleLanguage(false);
      setSelectedHistoricalSession(null);
      restartCompanion(
        messages,
        socket,
        setDisplayRegistrationMessage,
        setChatText,
        reportUrl,
      );
    }
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
        <option className="text-white" value="de">
          {t("German")}
        </option>
      </select>
    </div>
  );
}

export default function LanguagesBtn() {
  const [toggleLanguage, setToggleLanguage] = useState<boolean>(false);
  const { t } = useTranslation();

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setToggleLanguage(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <>
      <button
        type="button"
        onClick={() => setToggleLanguage(!toggleLanguage)}
        className="flex flex-col items-center lg:flex-row relative top-0.5"
      >
        <MdLanguage className="h-[1.7rem] w-[1.7rem] text-[#4a4a4a] pr-1" />
        <span className="text-[#4a4a4a]">{t("Language")}</span>
      </button>

      {toggleLanguage && (
        <LanguageDropDown setToggleLanguage={setToggleLanguage} />
      )}
    </>
  );
}
