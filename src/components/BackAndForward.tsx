import ProgressButton from "./intro/ProgressButton.tsx";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.tsx";
import { useAppStore } from "../context/AppStore.ts";
import { useShallow } from "zustand/react/shallow";

export default function BackAndForward() {
  const { currentMessage, setCurrentMessage, messages } =
    useContext(AppContext);
  const { expectedNodes } = useAppStore(useShallow((state) => ({ ...state })));
  const isFinalMessage = currentMessage === expectedNodes - 1;
  if (messages?.length <= 1 || isFinalMessage) {
    return null;
  }

  function onNext() {
    if (!isNextDisabled()) {
      setCurrentMessage(currentMessage + 1);
    }
  }

  function isNextDisabled() {
    return currentMessage === messages.length - 1;
  }

  function onPrevious() {
    if (!isPreviousDisabled()) {
      setCurrentMessage(currentMessage - 1);
    }
  }

  function isPreviousDisabled() {
    return currentMessage === 0;
  }

  return (
    <div className="hidden md:flex items-start pt-3">
      <ProgressButton
        handlerFunc={onPrevious}
        translationKey={"Previous"}
        imgPath={"./tour/triangle-left.svg"}
        disabled={isPreviousDisabled()}
      />
      <span className="px-1" />
      <ProgressButton
        handlerFunc={onNext}
        translationKey={"Next"}
        imgPath={"./tour/triangle-right.svg"}
        disabled={isNextDisabled()}
      />
    </div>
  );
}
