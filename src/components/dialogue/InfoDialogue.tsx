import { useTranslation } from "react-i18next";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import OnepointInfo from "./OnepointInfo.tsx";
import GenericDialogue from "./GenericDialogue.tsx";
import DialogueHeader from "./DialogueHeader.tsx";
import InfoIcon from "./InfoIcon.tsx";
import useShowIntroDialogue from "../../hooks/useShowIntroDialogue.ts";

export const INFO_DIALOGUE_ID = "info-dialogue";

function InfoSection({ children }: { children: React.ReactNode }) {
  return <section className="mx-3 mt-5">{children}</section>;
}

/**
 * Used to display information about the application.
 * @constructor
 */
export default function InfoDialogue() {
  const showIntroDialogue = useShowIntroDialogue();
  const { t } = useTranslation();

  return (
    <GenericDialogue dialogueId={INFO_DIALOGUE_ID} clazz="companion-dialogue">
      <DialogueHeader
        onClose={() => onCloseDialogue(INFO_DIALOGUE_ID)}
        className="!pl-3 !pr-0 !pt-0"
      >
        <InfoIcon name="info_dialogue" />
      </DialogueHeader>
      <InfoSection>
        <OnepointInfo />
      </InfoSection>
      <InfoSection>
        <a className="default-link" href="#" onClick={showIntroDialogue}>
          {t("Usage instructions")}
        </a>
      </InfoSection>
    </GenericDialogue>
  );
}
