import i18next from "i18next";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImSwitch } from "react-icons/im";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import { restartSession } from "../../lib/websocketFunctions.ts";
import ButtonPanel from "./ButtonPanel.tsx";

export const RESTART_DIALOGUE_ID = "restart-dialogue";

const MIN_STEPS = 4;

const MAX_STEPS = 8;

export default function RestartDialogue() {
  const { socket } = useContext(ChatContext);
  const { t } = useTranslation();
  const language = i18next?.language;

  console.log("RestartDialogue", language);
  const {
    expectedNodes,
    setRestartOpen,
    messages,
    setDisplayRegistrationMessage,
  } = useContext(AppContext);
  const [expectedInteviewSteps, setExpectedInterviewSteps] =
    useState(expectedNodes);

  function onClose() {
    setRestartOpen(false);
    onCloseDialogue(RESTART_DIALOGUE_ID);
  }

  function onOk() {
    restartSession(
      socket.current,
      messages,
      expectedInteviewSteps,
      setDisplayRegistrationMessage
    );
    setRestartOpen(false);
    onClose();
  }

  return (
    <div
      id={RESTART_DIALOGUE_ID}
      className={`absolute ${language === "fa" ? "-left-12" : "right-4"} companion-dialogue top-20`}
    >
      <div className="companion-dialogue-content">
        <h2>
          <ImSwitch className="inline relative -top-1 fill-[#0084d7]" />{" "}
          {t("Restart")}
        </h2>
        <section className="mx-3 mt-10">
          <p>{t("Would you like to restart the companion?")}</p>
          <div className="companion-dialogue-config">
            <label htmlFor="expectedInteviewSteps">
              {t("Interview Steps")}:{" "}
            </label>
            <select
              id="expectedInteviewSteps"
              value={expectedInteviewSteps}
              onChange={(e) =>
                setExpectedInterviewSteps(parseInt(e.target.value))
              }
            >
              {Array.from({ length: MAX_STEPS - MIN_STEPS + 1 }, (_, i) => (
                <option key={i} value={i + MIN_STEPS}>
                  {i + MIN_STEPS}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>

      <ButtonPanel
        onOk={onOk}
        onClose={onClose}
        okText={t("ok")}
        disabled={false}
      />
    </div>
  );
}
