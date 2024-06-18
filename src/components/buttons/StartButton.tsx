import { ImSwitch } from "react-icons/im";
import { FaRegHandPointRight } from "react-icons/fa";
import { RESTART_DIALOGUE_ID } from "../dialogue/RestartDialogue.tsx";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext.tsx";
import { showDialogue } from "../../lib/dialogFunctions.ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../@/components/ui/popover.tsx";
import { useTranslation } from "react-i18next";
import { toast } from "../../../@/components/ui/use-toast.ts";
import { IoIosClose } from "react-icons/io";

export default function StartButton() {
  const { t } = useTranslation();
  const { connected, isFinalMessage } = useContext(AppContext);
  const [popoverOpen, setPopoverOpen] = useState(false);

  function showStartDialogue() {
    showDialogue(RESTART_DIALOGUE_ID);
    setPopoverOpen(false);
  }

  useEffect(() => {
    setPopoverOpen(isFinalMessage);
  }, [isFinalMessage]);

  const closePopover = () => setPopoverOpen(false)

  return (
    <>
      <ImSwitch
        className="restart-button"
        title="Restart"
        onClick={
          !connected
            ? () => {
                toast({
                  title: t("You are disconnected."),
                  description: t(
                    "You are disconnected. The Data Wellness Companion needs to be connected to restart.",
                  ),
                });
              }
            : showStartDialogue
        }
      />
      <Popover defaultOpen={false} open={popoverOpen}>
        <PopoverTrigger></PopoverTrigger>
        <PopoverContent className="border-0 outline-0 rounded-2xl bg-white shadow mt-4 relative">
          <FaRegHandPointRight className="inline relative -top-1 w-5 h-5" />{" "}
          {t("Click")}{" "}
          <ImSwitch
            className="inline relative -top-1"
            onClick={closePopover}
          />{" "}
          {t("to restart the application")}.
          <IoIosClose className="absolute top-2 right-2 h-10 w-8 cursor-pointer" onClick={closePopover}/>
        </PopoverContent>
      </Popover>
    </>
  );
}
