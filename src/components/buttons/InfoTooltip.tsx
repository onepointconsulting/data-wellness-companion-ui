import { useTranslation } from "react-i18next";
import { FaInfoCircle } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";

const InfoToolTip = () => {
  const { t } = useTranslation();

  return (
    <ReactTooltip
      id="user-info-tooltip"
      place="bottom"
      className="!w-[66.666667%] lg:!w-[20rem] h-auto !p-3 !bg-gray-50 !opacity-100 !bg-opacity-100 !rounded-xl !text-gray-600 !shadow-slate-300 !shadow-lg"
    >
      {/* Body */}
      <div className="tooltip-body">
        <div className="companion-dialogue-content">
          <div className="flex items-center gap-4 px-4">
            <FaInfoCircle className="inline relative -top-0.5 !text-2xl fill-[#0084d7]" />{" "}
            <h4>{t("Info")}</h4>
          </div>

          <section className="mx-3 mt-10">
            <p>
              {t("The")}{" "}
              <a
                href="https://www.onepointltd.com/"
                target="_blank"
                className="default-link"
              >
                Onepoint
              </a>{" "}
              {t(
                "Data Wellness Companion™ is an assistant which will ask you questions to help you reflect on your data"
              )}
              .
              <br />
              {t(
                "It will go through a series of questions and then will provide you with a report at the end"
              )}
            </p>
            <br />
            <p>
              {t("This application is powered by")}{" "}
              <a
                className="default-link"
                href="https://openai.com/gpt-4"
                target="_blank"
              >
                {t("ChatGPT 4")}.
              </a>
            </p>
          </section>
        </div>
      </div>
    </ReactTooltip>
  );
};

export default InfoToolTip;
