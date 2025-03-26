import {MdOutlineArticle} from "react-icons/md";
import useGenerationReportNow from "../../hooks/useGenerateReportNow.ts";
import DecisionButtons from "./DecisionButton.tsx";
import {useAppStore} from "../../context/AppStore.ts";
import {useShallow} from "zustand/react/shallow";
import {messagesOverLowerLimit} from "../../lib/confidenceAdapter.ts";
import {useContext} from "react";
import {AppContext} from "../../context/AppContext.tsx";

export default function GiveMeReport() {
    const { messages, isSuggestionDeactivated } = useContext(AppContext);
    const { messageLowerLimit } = useAppStore(
        useShallow((state) => ({
            messageLowerLimit: state.messageLowerLimit,
        })),
    );

    const { handleGiveMeReportNow } = useGenerationReportNow()

    if(!messagesOverLowerLimit(messages, messageLowerLimit + 1) || isSuggestionDeactivated) {
        return null
    }

    function giveMeReportNow() {
        handleGiveMeReportNow()
    }

    return (
        <div className="flex flex-row justify-end mt-4">
            <DecisionButtons
                label={"Generate report now"}
                onClick={giveMeReportNow}
                icon={<MdOutlineArticle className="w-8 h-8" />}
            />
        </div>
    )
}