import { Message } from "../model/message.ts";
import { useContext, useEffect, useState } from "react";
import LightBulb from "./buttons/LightBulb.tsx";
import { JoyrideContext } from "../context/JoyrideContext.tsx";
import { useJoyrideStore } from "../context/JoyrideStore.ts";
import Regenerate from "./buttons/Regenerate.tsx";

const STEP_MILLI_SECONDS = 25;

function incrementalText(text: string, setMessageText: (text: string) => void) {
  let i = 0;
  const interval = setInterval(() => {
    setMessageText(text.slice(0, i));
    i++;
    if (i > text.length) {
      clearInterval(interval);
    }
  }, STEP_MILLI_SECONDS);
}

export default function Question({
  message,
  currentMessage,
  messagesLength,
}: {
  message: Message;
  currentMessage: number;
  messagesLength: number;
}) {
  const { questionRef } = useContext(JoyrideContext);
  const setInitQuestionRef = useJoyrideStore(
    (state) => state.setInitQuestionRef,
  );
  const [messageText, setMessageText] = useState<string>("");

  useEffect(() => {
    setInitQuestionRef();
  }, []);

  useEffect(() => {
    if (currentMessage === 0 && messagesLength < 2) {
      incrementalText(message.question, setMessageText);
    } else {
      setMessageText(message.question);
    }
  }, [message, currentMessage]);

  return (
    <>
      <div className="question container" ref={questionRef}>
        <div className="dark:text-gray-100 w-full">
          <div className="flex">
            <div className="flex-1">
              {messageText}
              <span className="px-1" /> <LightBulb />
            </div>
            {/*<BackAndForward />*/}
          </div>
          <Regenerate />
        </div>
      </div>
    </>
  );
}
