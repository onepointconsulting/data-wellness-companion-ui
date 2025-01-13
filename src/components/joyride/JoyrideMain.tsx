import { useContext, useEffect } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { JoyrideContext } from "../../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../../context/JoyrideStore.ts";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
import SendImage from "../buttons/SendImage.tsx";
import useShowIntroDialogue from "../../hooks/useShowIntroDialogue.ts";
import ConfidenceLevels from "./ConfidenceLevels.tsx";
import { AppContext } from "../../context/AppContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import {
  isAutoStart,
  isFinished,
  setAutoStart,
  setTourFinished,
} from "../../lib/joyrideFunctions.ts";

export default function JoyrideMain() {
  const showIntroDialogue = useShowIntroDialogue();
  const [t] = useTranslation();
  const { joyrideState, setJoyrideState, initQuestionRef } = useJoyrideStore(
    useShallow((state) => ({
      joyrideState: state.joyrideState,
      setJoyrideState: state.setJoyrideState,
      initQuestionRef: state.initQuestionRef,
    })),
  );
  const { questionRef, navbarRef } = useContext(JoyrideContext);
  const { currentMessage } = useContext(AppContext);
  const { run, steps } = joyrideState;

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setJoyrideState({ ...joyrideState, run: false });
      setAutoStart(false);
      setTourFinished();
    }
  };

  const baseSlide = {
    disableBeacon: isAutoStart(),
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

  useEffect(() => {
    if (!isFinished() && initQuestionRef && navbarRef) {
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
            target: ".chat-container",
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
            target: "#send-button",
            title: t("Instruction: Send button"),
          },
          {
            content: (
              <>
                <div className="text-left">
                  {t(
                    "Instruction: suggested-answer-text",
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
                <>
                  <div className="text-left">
                    {t(
                        "Instruction: suggested-answer-text",
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
              <>
                <div className="text-left">
                  {t(
                    "Instruction: Navigate between questions using the progress bar.",
                  )}
                </div>
                <div className="text-left">
                  {t(
                    "Instruction: You will see a smiley on top of this bar with the internal confidence levels of the tool",
                  )}
                </div>
                <ConfidenceLevels />
              </>
            ),
            ...baseSlide,
            placement: "bottom",
            target: navbarRef?.current!,
            title: t("Instruction: Progress bar"),
          },
          {
            content: (
              <div className="text-left">
                {t("Instruction: For more informations on D-Well check the")}{" "}
                <br />
                <a
                  href="#"
                  onClick={showIntroDialogue}
                  className="default-link"
                >
                  {t("D-Well Tour")}
                </a>
              </div>
            ),
            ...baseSlide,
            placement: "center",
            target: "body",
            title: t("Instruction: More on D-Well"),
            locale: { last: t("Finish") },
          },
        ],
      });
    }
  }, [initQuestionRef, navbarRef]);

  if (isFinished() || currentMessage > 0) {
    return null;
  }

  return (
    <ErrorBoundary fallback={<></>}>
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
    </ErrorBoundary>
  );
}
