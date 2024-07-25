import { useTranslation } from "react-i18next";
import { toast } from "../../../@/components/ui/use-toast.ts";
import restartCompanion from "../../lib/restartFunctions.ts";
import { ChangeEvent, useContext } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import MenuSelectorBase from "./MenuSelectorBase.tsx";

/**
 * The language switch component used to change the language of the user interface and interaction.
 * @param setOpen
 * @constructor
 */
export default function LanguageSwitch({
  setOpen,
}: {
  setOpen: (b: boolean) => void;
}) {
  const { i18n, t } = useTranslation();
  const { connected, setChatText, setSelectedHistoricalSession } =
    useContext(AppContext);
  const { socket } = useContext(ChatContext);
  const { messages, setDisplayRegistrationMessage } = useContext(AppContext);

  const onClickLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!connected) {
      toast({
        title: t("You are disconnected."),
        description: t(
          "The Data Wellness Companion needs to be connected to change the language.",
        ),
      });
    } else {
      const language = e?.target?.value;
      i18n.changeLanguage(language);
      setOpen(false);
      setSelectedHistoricalSession(null);
      restartCompanion(
        messages,
        socket,
        setDisplayRegistrationMessage,
        setChatText,
      );
    }
  };

  return (
    <MenuSelectorBase
      image={
        <svg
          width="21"
          height="21"
          viewBox="0 0 21 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="pl-3 w-8 h-8 dark:fill-white fill-[#4A4A4A]"
        >
          <g clipPath="url(#clip0_801_1015)">
            <path d="M10.5 0C4.71848 0 0 4.71885 0 10.5C0 16.2815 4.71885 21 10.5 21C16.2815 21 21 16.2812 21 10.5C21 4.71848 16.2812 0 10.5 0ZM7.38499 1.76954C6.6668 2.68722 6.14845 3.82249 5.7905 4.92188H3.10168C4.1824 3.49203 5.66733 2.38424 7.38499 1.76954ZM2.31545 6.15193H5.4472C5.17305 7.31764 5.01125 8.57969 4.97241 9.88477H1.25139C1.33973 8.54327 1.71458 7.27892 2.31545 6.15193ZM1.25139 11.1152H4.97241C5.01076 12.4051 5.1694 13.6527 5.43777 14.8066H2.29376C1.70559 13.6904 1.33867 12.4405 1.25139 11.1152ZM3.07039 16.0371H5.77713C6.13672 17.153 6.65979 18.3038 7.38499 19.2305C5.65085 18.6099 4.15365 17.4869 3.07039 16.0371ZM9.88477 19.6643C8.50582 19.1969 7.56755 17.4097 7.07589 16.0371H9.88477V19.6643ZM9.88477 14.8066H6.70265C6.4148 13.6688 6.24426 12.418 6.20333 11.1152H9.88477V14.8066ZM9.88477 9.88477H6.20333C6.24475 8.56632 6.41903 7.30111 6.71323 6.15234H9.88477V9.88477ZM9.88477 4.92188H7.09062C7.58276 3.56336 8.51669 1.7994 9.88477 1.33571V4.92188ZM17.8983 4.92188H15.2095C14.8516 3.82274 14.3333 2.68738 13.615 1.76954C15.3327 2.38424 16.8176 3.49203 17.8983 4.92188ZM11.1152 1.33571C12.4835 1.79948 13.4174 3.56368 13.9094 4.92188H11.1152V1.33571ZM11.1152 6.15234H14.2868C14.5809 7.30111 14.7552 8.56632 14.7967 9.88477H11.1152V6.15234ZM11.1152 11.1148H14.7967C14.7557 12.418 14.5852 13.6688 14.2973 14.8066H11.1152V11.1148ZM11.1152 19.6643V16.0367H13.9241C13.4328 17.4088 12.4945 19.1968 11.1152 19.6643ZM13.615 19.2305C14.3403 18.3037 14.8633 17.1528 15.2229 16.0367H17.9296C16.8463 17.4869 15.3492 18.6099 13.615 19.2305ZM18.7062 14.8066H15.5623C15.8306 13.6527 15.9893 12.4051 16.0276 11.1148H19.7487C19.6613 12.4405 19.2944 13.6904 18.7062 14.8066ZM19.7486 9.88477H16.0276C15.9888 8.57969 15.8269 7.31764 15.5528 6.15234H18.6845C19.2854 7.27892 19.6603 8.54327 19.7486 9.88477Z" />
          </g>
          <defs>
            <clipPath id="clip0_801_1015">
              <rect width="21" height="21" fill="white" />
            </clipPath>
          </defs>
        </svg>
      }
      select={
        <select
          className="menu-select"
          onChange={onClickLanguageChange}
          value={i18n.language}
        >
          <option value="en">{t("English")}</option>
          <option value="de">{t("German")}</option>
        </select>
      }
    />
  );
}
