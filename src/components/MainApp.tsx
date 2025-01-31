import HamburgerMenuContextProvider from "../context/HamburgerMenuContext.tsx";
import HamburgerMenu from "./menu/HamburgerMenu.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import MainPanel from "./MainPanel.tsx";
import NodeNavigation from "./NodeNavigation.tsx";
import { Toaster } from "../../@/components/ui/toaster.tsx";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import JoyrideMain from "./joyride/JoyrideMain.tsx";
import NavigationTab from "./NavigationTabs.tsx";

export default function MainApp() {
  const [t] = useTranslation();
  const { displayRegistrationMessage } = useContext(AppContext);

  const imageAlt = t("logo-alt");

  const imageNodeFunc = () => {
    return <img className="w-52 lg:w-72" src="logo.svg" alt={imageAlt} />;
  };

  return (
    <>
      <JoyrideMain />
      <div className="header">
        <div className="header-container">
          <div className="flex flex-row items-end">{imageNodeFunc()}</div>
          <HamburgerMenuContextProvider>
            <HamburgerMenu />
          </HamburgerMenuContextProvider>
        </div>
      </div>
      <div className="container">
        <div className="flex flex-row">
          <div className="w-full">
            {displayRegistrationMessage ? (
              <RegistrationMessage />
            ) : (
              <NavigationTab>
                <MainPanel />
              </NavigationTab>
            )}
          </div>
          <div>
            <NodeNavigation />
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
