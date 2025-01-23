import onCloseDialogue from "../../../lib/dialogFunctions.ts";
import DialogueHeader from "../../dialogue/DialogueHeader.tsx";
import React, {useContext} from "react";
import {QuestionsContext} from "../questions/questionsReducer.tsx";
import {useTranslation} from "react-i18next";


export const IMAGE_SVG_DIALOGUE_ID = "image-svg-dialogue";

function onClose() {
    onCloseDialogue(IMAGE_SVG_DIALOGUE_ID);
}

export default function ImageSvgDialogue() {
    const [t] = useTranslation();
    const { state } = useContext(QuestionsContext);
    function onSaveSvg(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault()
    }
    return (
        <dialog
            data-model={true}
            id={IMAGE_SVG_DIALOGUE_ID}
            className="companion-dialogue"
        >
            <DialogueHeader onClose={onClose}>
                {state.editSuggestion?.svg_image && <div dangerouslySetInnerHTML={{__html: state.editSuggestion?.svg_image}}/>}
            </DialogueHeader>
            <form className="mx-6 my-4">
                <textarea className="w-full min-h-64 p-2 my-2" value={state.editSuggestion?.svg_image ?? ""}/>
                <div className="flex justify-end">
                    <button className="final-report-email w-24 !mx-0" onClick={onSaveSvg}>{t("Save")}</button>
                </div>
            </form>
        </dialog>
    )
}