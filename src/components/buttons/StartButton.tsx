import { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaRegHandPointRight } from "react-icons/fa";
import { ImSwitch } from "react-icons/im";
import { AppContext } from "../../context/AppContext.tsx";

function RestartNotice() {
  const { t } = useTranslation();

  return (
    <div className="absolute top-8 right-4">
      <div className="mt-4 bg-white cursor-auto z-50 flex flex-col border-0 shadow outline-0 rounded-2xl p-4 w-[10rem] md:w-[15rem]">
        <div className="flex items-end gap-2">
          <FaRegHandPointRight className="relative inline w-5 h-5 -top-1" />{" "}
          {t("Click")}
          <ImSwitch className="relative inline -top-1" />{" "}
        </div>

        <div className="flex items-end gap-2">
          {t("to restart the application")}.
        </div>
      </div>
    </div>
  );
}

export default function StartButton() {
  const {
    connected,
    isFinalMessage,
    setRestartPopOpen,
    setRestartOpen,
    restartOpen,
    isRestartPopOpen,
    setLanguageOpen,
  } = useContext(AppContext);

  useEffect(() => {
    isFinalMessage && setRestartPopOpen(isFinalMessage);
  }, [isFinalMessage]);

  const handleRestartClick = () => {
    if (!connected) {
      alert(
        "You are disconnected. Please connect to restart the Data Wellness Companion."
      );
    } else {
      setRestartPopOpen(false);
      setRestartOpen(!restartOpen);
      setLanguageOpen(false);
    }
  };

  return (
    <>
      <ImSwitch
        className="restart-button"
        title="Restart"
        onClick={handleRestartClick}
      />

      {isRestartPopOpen && isFinalMessage && <RestartNotice />}
    </>
  );
}
