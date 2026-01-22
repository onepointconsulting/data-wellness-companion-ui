import MenuItemTemplate from "./MenuItemTemplate.tsx";
import { getSessionHistory } from "../../lib/sessionFunctions.ts";
import { GoHistory } from "react-icons/go";
import { Session } from "../../model/session.ts";
import { useTranslation } from "react-i18next";
import { useAppStore } from "../../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";
import { HamburgerMenuContext } from "../../context/HamburgerMenuContext.tsx";
import { useContext } from "react";
import MenuSeparator from "./MenuSeparator.tsx";

const finishedFilter = (session: Session) => session.finished;

/**
 * Used to open the history sidebar.
 * @constructor
 */
export default function SessionSwitch() {
  const { setOpen } = useContext(HamburgerMenuContext);
  const { setHistorySidebarOpen } = useAppStore(
    useShallow((state) => ({
      setHistorySidebarOpen: state.setHistorySidebarOpen,
    })),
  );
  const { t } = useTranslation();
  const sessionHistory = getSessionHistory();

  if (!sessionHistory || sessionHistory.filter(finishedFilter).length === 0) {
    return <></>;
  }

  return (
    <>
      <MenuItemTemplate
        title={t("Show History")}
        func={() => {
          setHistorySidebarOpen(true);
          setOpen(false);
        }}
      >
        <div className="w-[32px] h-[32px] flex items-center justify-center">
          <GoHistory className="w-full h-full text-[#4A4A4A] dark:text-gray-200" />
        </div>
      </MenuItemTemplate>
      <MenuSeparator />
    </>
  );
}
