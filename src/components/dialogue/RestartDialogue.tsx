import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { ImSwitch } from "react-icons/im";
import { AppContext } from "../../context/AppContext.tsx";
import { ChatContext } from "../../context/ChatContext.tsx";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import ButtonPanel from "./ButtonPanel.tsx";
import restartCompanion from "../../lib/restartFunctions.ts";

export const RESTART_DIALOGUE_ID = "restart-dialogue";

const MIN_STEPS = 4;

const MAX_STEPS = 8;

function onClose() {
  onCloseDialogue(RESTART_DIALOGUE_ID);
}

function Slider({
  value,
  onChange,
}: {
  value: number;
  onChange: (e: any) => void;
}) {
  return (
    <div className="w-full">
      <div className="pl-2 flex flex-1">
        <div className="pr-4 font-bold">{value}</div>
          <div className="flex flex-col w-full">
            <input
              id="expectedInterviewSteps"
              type="range"
              value={value}
              min={MIN_STEPS}
              max={MAX_STEPS}
              step={1}
              onChange={onChange}
              list="expectedInterviewStepsValues"
            />
            <datalist id="expectedInterviewStepsValues">
              {Array.from({ length: MAX_STEPS - MIN_STEPS + 1 }, (_, i) => (
                <option key={i} value={i + MIN_STEPS} label={`${i + MIN_STEPS}`} />
              ))}
            </datalist>
          </div>
      </div>
    </div>
  );
}

export default function RestartDialogue() {
  const { socket } = useContext(ChatContext);
  const { t } = useTranslation();
  const {
    expectedNodes,
    messages,
    setDisplayRegistrationMessage,
    setChatText,
  } = useContext(AppContext);
  const [expectedInterviewSteps, setExpectedInterviewSteps] =
    useState(expectedNodes);

  function onOk() {
    restartCompanion(
      messages,
      socket,
      expectedInterviewSteps,
      setDisplayRegistrationMessage,
      setChatText,
    );
    onClose();
  }

  return (
    <dialog
      data-model={true}
      id={RESTART_DIALOGUE_ID}
      className="companion-dialogue"
    >
      <div className="companion-dialogue-content">
        <h2>
          <ImSwitch className="inline relative fill-[#055D94]" />{" "}
          {t("Restart")}
        </h2>
        <section className="mx-3 mt-8">
          <p>{t("Would you like to restart the companion?")}</p>
          <div className="companion-dialogue-config">
            <label htmlFor="expectedInterviewSteps" className="text-nowrap">
              {t("Interview Steps")}:{" "}
            </label>
            <Slider
              value={expectedInterviewSteps}
              onChange={(e) =>
                setExpectedInterviewSteps(parseInt(e.target.value))
              }
            />
          </div>
        </section>
      </div>

      <ButtonPanel
        onOk={onOk}
        onClose={onClose}
        okText={t("ok")}
        disabled={false}
      />
    </dialog>
  );
}
