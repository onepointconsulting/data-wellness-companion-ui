import {
  CallBackProps,
  STATUS,
  ACTIONS,
  Step,
  EVENTS,
  Events,
} from "react-joyride";
import {
  createContext,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Props } from "./commonModel.ts";
import { useTranslation } from "react-i18next";

export interface State {
  run: boolean;
  sidebarOpen: boolean;
  stepIndex: number;
  steps: Step[];
}

export type JoyrideState = {
  joyrideState: State;
  setJoyrideState: (state: State) => void;
  mainQuestionRef: RefObject<HTMLDivElement> | null;
  hamburgerMenu: RefObject<HTMLDivElement> | null;
  handleJoyrideCallback: (data: CallBackProps) => void;
  setInitState: (state: boolean) => void
};

export const JoyrideContext = createContext<JoyrideState>({
  joyrideState: {
    run: false,
    sidebarOpen: false,
    stepIndex: 0,
    steps: [],
  },
  setJoyrideState: (_) => {},
  handleJoyrideCallback: (_) => {},
  mainQuestionRef: null,
  hamburgerMenu: null,
  setInitState: (_) => {}
});

const baseSlide = {
  disableBeacon: true,
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

export default function JoyrideContextProvider({ children }: Props) {
  const [t] = useTranslation();
  const hamburgerMenu: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const mainQuestionRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const [initState, setInitState] = useState(false);
  const [joyrideState, setJoyrideState] = useState<State>({
    run: false,
    sidebarOpen: false,
    stepIndex: 0,
    steps: [],
  });
  useEffect(() => {
    if(initState) {
      setJoyrideState({
        run: true,
        sidebarOpen: true,
        stepIndex: 0,
        steps: [
          {
            content: (
                <div className="text-left">
                  {t("Instruction: the initial question to start the conversation")}
                </div>
            ),
            placement: "bottom",
            ...baseSlide,
            target: mainQuestionRef?.current!,
            title: t("Instruction: Initial question"),
          },
          {
            content: (
                <div className="text-left">
                  {t(
                      "Instruction: open the menu to access to access the following functions:",
                  )}
                  <ul>
                    <li>{t("Instruction: Restart the application")}</li>
                    <li>{t("Instruction: Help")}</li>
                    <li>{t("Instruction: Contact Us")}</li>
                    <li>...</li>
                  </ul>
                  {t("Instruction: Click the menu above!")}
                </div>
            ),
            placement: "bottom",
            ...baseSlide,
            target: hamburgerMenu?.current!,
            title: t("Instruction: Menu"),
          },
        ],
      });
    }
  }, [initState]);

  const handleJoyrideCallback = useCallback(
    (data: CallBackProps) => {
      const { action, index, status, type } = data;
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);
      if (
        ([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status) ||
        ACTIONS.CLOSE === action ||
        (ACTIONS.NEXT === action && index >= joyrideState.steps.length)
      ) {
        // Need to set our running state to false, so we can restart if we click start again.
        setJoyrideState({ ...joyrideState, run: false, stepIndex: 0 });
      } else if (
        ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND] as Events[]).includes(
          type,
        )
      ) {
        console.log("setJoyrideState", index);
        setJoyrideState({
          run: true,
          sidebarOpen: false,
          steps: joyrideState.steps,
          stepIndex: nextStepIndex,
        });
      }
    },
    [joyrideState, setJoyrideState],
  );

  return (
    <JoyrideContext.Provider
      value={{
        joyrideState,
        setJoyrideState,
        mainQuestionRef,
        hamburgerMenu,
        handleJoyrideCallback,
        setInitState
      }}
    >
      {children}
    </JoyrideContext.Provider>
  );
}
