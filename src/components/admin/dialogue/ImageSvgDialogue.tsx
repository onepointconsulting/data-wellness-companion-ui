import onCloseDialogue from "../../../lib/dialogFunctions.ts";
import DialogueHeader from "../../dialogue/DialogueHeader.tsx";
import React, { useContext, useEffect, useState } from "react";
import { QuestionsContext } from "../questions/questionsReducer.tsx";
import { useTranslation } from "react-i18next";
import AdminMessage from "../AdminMessage.tsx";
import { MessageType } from "../model.ts";

export const IMAGE_SVG_DIALOGUE_ID = "image-svg-dialogue";

export default function ImageSvgDialogue() {
  const [t] = useTranslation();
  const { state, dispatch } = useContext(QuestionsContext);
  const [editSuggestion, setEditSuggestion] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    setEditSuggestion(state.editSuggestion?.svg_image ?? "");
  }, [setEditSuggestion, state.editSuggestion?.svg_image]);

  function onClose() {
    setMessage("");
    onCloseDialogue(IMAGE_SVG_DIALOGUE_ID);
  }

  function onSaveSvg(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (state.editQuestion && state.editSuggestion) {
      const newSuggestion = {
        ...state.editSuggestion,
        svg_image: editSuggestion,
      };
      dispatch({
        type: "saveSuggestionSvg",
        editQuestion: state.editQuestion,
        editSuggestion: newSuggestion,
      });
      setMessage(t("Success!"));
      setTimeout(() => setMessage(""), 5000);
    }
  }
  return (
    <dialog
      data-model={true}
      id={IMAGE_SVG_DIALOGUE_ID}
      className="companion-dialogue"
    >
      <DialogueHeader onClose={onClose}>
        {editSuggestion && (
          <div dangerouslySetInnerHTML={{ __html: editSuggestion }} />
        )}
      </DialogueHeader>
      <form className="mx-6 my-4">
        {message && (
          <AdminMessage message={message} messageType={MessageType.SUCCESS} />
        )}
        <textarea
          className="w-full min-h-64 p-2 my-2 border-2 border-gray-300"
          value={editSuggestion}
          onChange={(e) => setEditSuggestion(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            className="final-report-email w-24 !ml-0 !mr-2"
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            {t("Close")}
          </button>
          <button className="final-report-email w-24 !mx-0" onClick={onSaveSvg}>
            {t("Save")}
          </button>
        </div>
      </form>
    </dialog>
  );
}
