import { useTranslation } from "react-i18next";
import { ChatContext } from "../../context/ChatContext";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { restartSession } from "../../lib/websocketFunctions";
import { languageList } from "../../lib/languageList";

export default function LanguageDropDown() {
  const { i18n, t } = useTranslation();
  const { socket } = useContext(ChatContext);
  const {
    messages,
    expectedNodes,
    setLanguageOpen,
    setDisplayRegistrationMessage,
  } = useContext(AppContext);

  const onClickLanguageChange = (e: any) => {
    const language = e.target.value;
    i18n.changeLanguage(language);
    restartSession(
      socket.current,
      messages,
      expectedNodes,
      setDisplayRegistrationMessage
    );
    setLanguageOpen(false);
  };

  return (
    <div className="absolute w-max h-auto p-2 bg-white shadow-2xl rounded-[5px] -right-7 top-16 flex flex-col gap-8 cursor-auto">
      <span className="pt-2 text-gray-600">{t("Select language")}</span>

      <ul className="rounded-[2px] z-50 text-gray-400 mt-[-1rem">
        {languageList?.map((lang) => (
          <li
            key={lang.lang}
            onClick={() =>
              onClickLanguageChange({ target: { value: lang.lang } })
            }
            className="grid grid-cols-2 place-content-center cursor-pointer hover:bg-[#cccccc] px-[2px] rounded-[2px]"
          >
            <img
              src={lang.flag}
              srcSet={lang.flag}
              alt="Language flag"
              className="h-[1.7rem] w-[1.7rem] text-white"
            />
            <p>{t(lang.name)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
