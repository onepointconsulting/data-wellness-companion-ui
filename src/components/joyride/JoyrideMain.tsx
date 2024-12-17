import { useContext, useEffect } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { JoyrideContext } from "../../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../../context/JoyrideStore.tsx";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import SendImage from "../buttons/SendImage.tsx";

const baseSlide = {
  disableBeacon: false,
  disableOverlayClose: false,
  hideCloseButton: false,
  hideFooter: false,
  spotlightClicks: true,
  styles: {
    options: {
      zIndex: 10000,
    },
  },
};

const KEY_FINISHED = "tourFinished_20241214";

export default function JoyrideMain() {
  const [t] = useTranslation();
  const {
    joyrideState,
    setJoyrideState,
    initChatInputRef,
    initQuestionRef,
    initSendButtonRef,
  } = useJoyrideStore(
    useShallow((state) => ({
      joyrideState: state.joyrideState,
      setJoyrideState: state.setJoyrideState,
      initChatInputRef: state.initChatInputRef,
      initQuestionRef: state.initQuestionRef,
      initSendButtonRef: state.initSendButtonRef,
    })),
  );
  const { questionRef, chatInputRef, hamburgerMenu, navbarRef, sendButtonRef } =
    useContext(JoyrideContext);
  const { run, steps } = joyrideState;

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideState({ ...joyrideState, run: false });
      window.localStorage.setItem(KEY_FINISHED, "true");
    }
  };

  useEffect(() => {
    if (
      window.localStorage.getItem(KEY_FINISHED) !== "true" &&
      initChatInputRef &&
      initQuestionRef &&
      navbarRef &&
      initSendButtonRef
    ) {
      setJoyrideState({
        run: true,
        sidebarOpen: true,
        stepIndex: 0,
        steps: [
          {
            content: (
              <div className="text-left">
                {t(
                  "Instruction: The initial question to start the conversation",
                )}
              </div>
            ),
            ...baseSlide,
            placement: "auto",
            target: questionRef?.current!,
            title: t("Instruction: Initial question"),
          },
          {
            content: (
              <div className="text-left">
                {t(
                  "Instruction: The text area that you can use to reply to the questions.",
                )}
              </div>
            ),
            ...baseSlide,
            target: chatInputRef?.current!,
            title: t("Instruction: Chat field"),
          },
          {
            content: (
              <>
                <div className="text-left">
                  {t("Instruction: Use this button to submit your response.")}
                </div>
                <div className="flex justify-center mt-3">
                  <SendImage enoughText={true} />
                </div>
              </>
            ),
            placement: "auto",
            ...baseSlide,
            target: sendButtonRef?.current!,
            title: t("Instruction: Send button"),
          },
          {
            content: (
              <>
                <div className="text-left">
                  {t(
                    "Instruction: You can use any suggested answers in this section. You can also select one and edit it or you can combined multiple selected answers too.",
                  )}
                </div>
              </>
            ),
            ...baseSlide,
            placement: "top",
            target: ".suggestions",
            title: t("Instruction: Suggested answers"),
          },
          {
            content: (
              <div className="text-left">
                {t(
                  "Instruction: Open the menu to access to access the following functions:",
                )}
                <ul className="menu-instructions">
                  <li>{t("Instruction: Restart the application")}</li>
                  <li>{t("Instruction: Help")}</li>
                  <li>{t("Instruction: Contact Us")}</li>
                  <li>{t("Instruction: Switch languages")}</li>
                  <li>...</li>
                </ul>
              </div>
            ),
            ...baseSlide,
            target: hamburgerMenu?.current!,
            title: t("Instruction: Menu"),
          },
          {
            content: (
              <div className="text-left">
                {t(
                  "Instruction: Navigate between questions using the progress bar.",
                )}
              </div>
            ),
            ...baseSlide,
            target: navbarRef?.current!,
            title: t("Instruction: Progress bar"),
          },
          {
            content: (
              <div className="text-left">
                {t(
                  "Instruction: If you are interested in a free consultation, please click here",
                )}
              </div>
            ),
            ...baseSlide,
            target: "#free-consultation",
            title: t("Instruction: Free consultation"),
          },
        ],
      });
    }
  }, [initChatInputRef, initQuestionRef, navbarRef, initSendButtonRef]);

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous={true}
      locale={{
        back: t("Instruction: Back"),
        nextLabelWithProgress: t("Instruction: Next ({step} of {steps})"),
        skip: t("Instruction: Skip"),
      }}
      run={run}
      scrollToFirstStep
      showProgress
      showSkipButton
      steps={steps}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#3698DC",
        },
      }}
    />
  );
}
