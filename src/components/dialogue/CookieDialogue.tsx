import { useContext, useEffect, useState } from "react";
import { AppContext, COOKIE_STATES } from "../../context/AppContext";
import { useTranslation } from "react-i18next";

const KEY_COOKIE_STATE = "cookieState";

export default function CookieDialogue() {
  const { cookieState, setCookieState } = useContext(AppContext);
  const [showDialogue, setShowDialogue] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const state = window.localStorage[KEY_COOKIE_STATE];
    if (!state) {
      setCookieState(COOKIE_STATES.UNKNOWN);
      handleNoCookies();
    } else {
      if (state === COOKIE_STATES.REJECTED) {
        handleNoCookies();
      }
      setCookieState(state);
    }
  }, []);

  function handleNoCookies() {
    // window["ga-disable-UA-YOUR-GA-ID"] = true;
    console.log("Cookies rejected");
    // window.localStorage[KEY_COOKIE_STATE] = COOKIE_STATES.REJECTED;
  }

  function handleAcceptCookies() {
    // window["ga-disable-UA-YOUR-GA-ID"] = false;
    console.log("Cookies accepted");
  }

  function onAccept() {
    window.localStorage[KEY_COOKIE_STATE] = COOKIE_STATES.ACCEPTED;
    setCookieState(COOKIE_STATES.ACCEPTED);
    handleAcceptCookies();
    setShowDialogue(false);
  }

  function onReject() {
    window.localStorage[KEY_COOKIE_STATE] = COOKIE_STATES.REJECTED;
    setCookieState(COOKIE_STATES.REJECTED);
    setShowDialogue(false);
  }

  if (cookieState === COOKIE_STATES.UNKNOWN && showDialogue) {
    return (
      <div className="z-40 flex flex-col justify-between w-full h-auto p-4 py-2 pb-8 bg-white shadow-2xl rounded-xl shadow-blue-400">
        <div className="relative w-full p-6">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            {t("Cookie Notice")} 🍪
          </h2>
          <p className="mb-4 text-gray-700">
            {t(
              "Welcome to HopeLink Companion, an AI chatbot assistant designed to provide guidance and assistance to refugees and immigrants. Our platform operates based on a knowledge-based system, where users are asked questions to provide tailored advice and suggestions."
            )}
          </p>
          <p className="mb-4 text-gray-700">
            {t(
              "As part of providing our services, we use cookies to enhance your experience and ensure the functionality of our platform. Cookies are small text files stored in your browser that allow us to recognize your preferences and improve the performance of our website."
            )}
          </p>
          <p className="mb-4 text-gray-700">
            {t(
              "By using HopeLink Companion, you consent to the use of cookies. Please note that we do not currently have a Cookie Policy in place. You can manage your cookie preferences at any time through your browser settings."
            )}
          </p>

          <p className="mb-4 text-gray-700">
            {t(
              "HopeLink Companion is available in multiple languages, including"
            )}
            <strong> {t("English, German")}</strong>, {t("and")}{" "}
            <strong>{t("Persian")}</strong>.
            {t(
              "We strive to make our platform accessible and user-friendly for individuals from diverse backgrounds."
            )}
          </p>
          <p className="mb-4 text-gray-700">
            {t(
              "If you have any questions or concerns about our use of cookies or our privacy practices, please contact us at"
            )}{" "}
            <a
              href="mailto:collaborate.afghangeeks@gmail.com"
              className="text-blue-500 underline"
            >
              collaborate.afghangeeks@gmail.com
            </a>
            .
          </p>
          <p className="text-gray-700">
            {t("Thank you for using HopeLink Companion.")}
          </p>
        </div>

        {/* Reject or Accept Buttons */}
        <div className="flex items-center justify-between w-full px-8">
          {/* Reject */}
          <div
            className="px-4 py-2 hover:text-gray-700 hover:scale-105 duration-300 text-base cursor-pointer text-white bg-gray-400 rounded-[6px]"
            onClick={onReject}
          >
            {t("Reject")}
          </div>

          {/* accept */}
          <div
            className="px-4 py-2 hover:text-gray-700 hover:scale-105 duration-300 text-base cursor-pointer text-white bg-gray-400 rounded-[6px]"
            onClick={onAccept}
          >
            {t("Accept")}
          </div>
        </div>
      </div>
    );
  }

  return <></>;
}
