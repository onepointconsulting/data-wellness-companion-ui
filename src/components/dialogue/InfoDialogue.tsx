import {FaInfoCircle} from "react-icons/fa";
import onCloseDialogue, {showDialogue} from "../../lib/dialogFunctions.ts";
import OnepointInfo from "./OnepointInfo.tsx";
import GenericDialogue from "./GenericDialogue.tsx";
import {INTRO_DIALOGUE_ID} from "./IntroDialogue.tsx";

export const INFO_DIALOGUE_ID = "info-dialogue";

function InfoSection({children} : {children: React.ReactNode}) {
  return (
    <section className="mx-3 mt-5">
      {children}
    </section>
  )
}

function showIntroDdialogue(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
  event.preventDefault()
  onCloseDialogue(INFO_DIALOGUE_ID)
  showDialogue(INTRO_DIALOGUE_ID)
}

/**
 * Used to display information about the application.
 * @constructor
 */
export default function InfoDialogue() {
  return (
    <GenericDialogue dialogueId={INFO_DIALOGUE_ID} clazz="companion-dialogue" buttons={<button
      data-close-modal={true}
      onClick={() => onCloseDialogue(INFO_DIALOGUE_ID)}
      className="button-cancel"
    >
      Close
    </button>}>
      <>
        <h2>
          <FaInfoCircle className="inline relative -top-0.5 fill-[#0084d7]"/>{" "}
          Info
        </h2>
        <InfoSection>
          <OnepointInfo/>
          <br/>
          <p>
            This application is powered by{" "}
            <a
              className="default-link"
              href="https://openai.com/gpt-4"
              target="_blank"
            >
              ChatGPT 4.
            </a>
          </p>
        </InfoSection>
        <InfoSection>
          <a className="default-link" href="#" onClick={showIntroDdialogue}>Usage instructions</a>
        </InfoSection>
      </>
    </GenericDialogue>
  );
}
