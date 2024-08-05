import NodeNavigation from "./NodeNavigation.tsx";
import {useWebsocket} from "../hooks/useWebsocket.ts";
import {useContext, useEffect} from "react";
import {AppContext} from "../context/AppContext.tsx";
import MainPanel from "./MainPanel.tsx";
import RestartDialogue from "./dialogue/RestartDialogue.tsx";
import EmailDialogue from "./dialogue/EmailDialogue.tsx";
import Disclaimer from "./Disclaimer.tsx";
import InfoDialogue from "./dialogue/InfoDialogue.tsx";
import RegistrationMessage from "./RegistrationMessage.tsx";
import useChatHistory from "../hooks/useChatHistory.ts";
import {Toaster} from "../../@/components/ui/toaster";
import HamburgerMenu from "./menu/HamburgerMenu.tsx";
import useConfidence from "../hooks/useConfidence.ts";
import {IntroSlides} from "./intro/IntroSlides.tsx";
import {useTranslation} from "react-i18next";
import {IoMdClose} from "react-icons/io";
import {INTRO_SLIDES} from "../intro/slides.tsx";


export default function CompanionParent() {
  const [t] = useTranslation();
  const {setStartSession, displayRegistrationMessage, seenIntro, setSeenIntro} =
    useContext(AppContext);

  useChatHistory();

  // Update the state of the session to start
  useEffect(() => {
    setStartSession(true);
  }, []);

  // Establish a websocket connection
  useWebsocket();

  useConfidence();

  const imageAlt = t("D-Well logo");

  const imageNodeFunc = (imageSize: string = "48") => {
    return <img className={`w-${imageSize}`} src="logo.svg" alt={imageAlt}/>
  }

  return (
    <>
      <IntroSlides showIntro={!seenIntro} setSeenIntro={setSeenIntro} imageNode={imageNodeFunc("72")}
                   closeIcon={<IoMdClose className="w-16 h-16"/>} slides={INTRO_SLIDES}/>
      <RestartDialogue/>
      <EmailDialogue/>
      <InfoDialogue/>
      {/*<IntroDialogue />*/}
      <div className="header">
        <div className="header-container">
          <div className="flex flex-row items-end">
            {imageNodeFunc()}
          </div>
          <HamburgerMenu/>
        </div>
      </div>
      <div className="container">
        <div className="flex flex-row gap-8">
          <div className="w-full">
            {displayRegistrationMessage && <RegistrationMessage/>}
            {!displayRegistrationMessage && <MainPanel/>}
            <Disclaimer/>
          </div>
          <div>
            <NodeNavigation/>
          </div>
        </div>
      </div>
      <Toaster/>
    </>
  );
}
