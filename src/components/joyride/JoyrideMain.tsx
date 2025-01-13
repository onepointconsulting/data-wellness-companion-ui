import { useContext, useEffect } from "react";
import Joyride, { CallBackProps, STATUS } from "react-joyride";
import { JoyrideContext } from "../../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../../context/JoyrideStore.ts";
import { useShallow } from "zustand/react/shallow";
import { useTranslation } from "react-i18next";
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
              <>
                <div className="text-left">
                  {t("Instruction: suggested-answer-text")}
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
                  {t("Instruction: monitor-progress-description")}
                </div>
              </>
            ),
            ...baseSlide,
            placement: "bottom",
            target: navbarRef?.current!,
            title: t("Instruction: monitor-progress"),
          },
          {
            content: (
              <div className="text-left">
                {t("Instruction: confidence-level-description")}{" "}
                <ConfidenceLevels />
              </div>
            ),
            ...baseSlide,
            placement: "center",
            target: "body",
            title: t("Instruction: confidence-level"),
            locale: { last: t("Finish") },
          },
          {
            content: (
              <div className="text-left">
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("Instruction: personalized-report-description"),
                  }}
                />
                <img
                  src="./screenshots/report-screenshot.png"
                  alt={t("Instruction: personalized-report")}
                />
              </div>
            ),
            ...baseSlide,
            placement: "center",
            target: "body",
            title: t("Instruction: personalized-report"),
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
