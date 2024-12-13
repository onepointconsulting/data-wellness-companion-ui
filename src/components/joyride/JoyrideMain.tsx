import {useContext, useEffect} from "react";
import Joyride, {CallBackProps, STATUS} from "react-joyride";
import {JoyrideContext} from "../../context/JoyrideContext.tsx";
import {useJoyrideStore} from "../../context/JoyrideStore.tsx";
import {useShallow} from "zustand/react/shallow";
import {useTranslation} from "react-i18next";


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

export default function JoyrideMain() {
    const [t] = useTranslation();
    const {joyrideState, setJoyrideState, initChatInputRef, initQuestionRef} = useJoyrideStore(useShallow(((state) => ({
        joyrideState: state.joyrideState,
        setJoyrideState: state.setJoyrideState,
        initChatInputRef: state.initChatInputRef,
        initQuestionRef: state.initQuestionRef
    }))))
    const {questionRef, chatInputRef, hamburgerMenu, navbarRef} = useContext(JoyrideContext)
    const {run, steps} = joyrideState;

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { status } = data;
        const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setJoyrideState({ ...joyrideState, run: false });
        }

    };

    useEffect(() => {
        if(initChatInputRef && initQuestionRef && navbarRef) {
            setJoyrideState({
                run: true,
                sidebarOpen: true,
                stepIndex: 0,
                steps: [
                    {
                        content: (
                            <div className="text-left">
                                {t("Instruction: The initial question to start the conversation")}
                            </div>
                        ),
                        placement: "auto",
                        ...baseSlide,
                        target: questionRef?.current!,
                        title: t("Instruction: Initial question"),
                    },
                    {
                        content: (
                            <div className="text-left">
                                {t("Instruction: The text area that you can use to reply to the questions.")}
                            </div>
                        ),
                        placement: "auto",
                        ...baseSlide,
                        target: chatInputRef?.current!,
                        title: t("Instruction: Chat field"),
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
                        placement: "auto",
                        ...baseSlide,
                        target: hamburgerMenu?.current!,
                        title: t("Instruction: Menu"),
                    },
                    {
                        content: (
                            <div className="text-left">
                                {t("Instruction: Navigate between questions using the progress bar.")}
                            </div>
                        ),
                        placement: "auto",
                        ...baseSlide,
                        target: navbarRef?.current!,
                        title: t("Instruction: Chat field"),
                    }
                ],
            });
        }
    }, [initChatInputRef, initQuestionRef, navbarRef]);

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
                    primaryColor: '#3698DC'
                },
            }}
        />
    )
}