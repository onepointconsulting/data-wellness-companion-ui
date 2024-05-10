import {FaInfoCircle} from "react-icons/fa";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import OnepointInfo from "./OnepointInfo.tsx";
import GenericDialogue from "./GenericDialogue.tsx";

export const INFO_DIALOGUE_ID = "info-dialogue";

/**
 * Used to display information about the application.
 * @constructor
 */
export default function InfoDialogue() {
  return (
    <GenericDialogue dialogueId={INFO_DIALOGUE_ID} clazz="companion-dialogue"
                     content={
                       <>
                         <h2>
                           <FaInfoCircle className="inline relative -top-0.5 fill-[#0084d7]"/>{" "}
                           Info
                         </h2>
                         <section className="mx-3 mt-10">
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
                         </section>
                       </>
                     } buttons={<button
      data-close-modal={true}
      onClick={() => onCloseDialogue(INFO_DIALOGUE_ID)}
      className="button-cancel"
    >
      Close
    </button>}>
    </GenericDialogue>
  );
}
