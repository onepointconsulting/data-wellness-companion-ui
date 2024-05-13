import GenericDialogue from "./GenericDialogue.tsx";
import { SiWelcometothejungle } from "react-icons/si";
import {FaRegLightbulb} from "react-icons/fa6";
import {VscExtensions} from "react-icons/vsc";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

import OnepointInfo from "./OnepointInfo.tsx";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import {setSeenIntro} from "../../lib/sessionFunctions.ts";
import {ImSwitch} from "react-icons/im";

export const INTRO_DIALOGUE_ID = "intro-dialogue";

const toolName = " Data Wellness Companion"

function IntroSection({content, children} : {content: React.ReactNode, children: React.ReactNode}) {
  return (
    <>
      <h3 className="pb-4 pt-2">
        <MdOutlineIntegrationInstructions className="inline relative -top-0.5 fill-[#0084d7]"/>{" "}
        {content}
      </h3>
      {children}
    </>
  )
}

/**
 * The introduction dialogue.
 * @constructor
 */
export default function IntroDialogue() {
  return (
    <GenericDialogue dialogueId={INTRO_DIALOGUE_ID} clazz="companion-dialogue" buttons={<button
      data-close-modal={true}
      onClick={() => {
        setSeenIntro();
        onCloseDialogue(INTRO_DIALOGUE_ID)
      }}
      className="button-cancel"
    >
      Close
    </button>}>
      <>
        <h2>
          <SiWelcometothejungle className="inline relative -top-0.5 fill-[#0084d7]"/>{" "}
          Welcome
        </h2>
        <section className="mx-3 mt-10">
          <OnepointInfo/>
          <br/>
          <IntroSection content={`How can you use the ${toolName}?`}>
            <p>The {toolName} will ask you an initial question which you can answer by either selecting one of the
              pre-defined answers or by typing your own answer.
            </p>
            <p>
              Here are some pre-defined answers on which you can click to select them:
              <img src={"screenshots/pre-defined-responses.png"} alt="Pre-defined answers" className="mx-auto mt-4 mb-5"/>
              After clicking on a pre-defined answer, the text will appear in the input field. In order to submit the answer,
              you will need to click on the "Submit" <img src="send_button.svg" alt="Submit" className="h-8 w-8 inline"/> button.
            </p>
            <br />
            <p>The {toolName} will then ask you a series of follow-up questions.
              During this process you will see the progress being displayed on the progress indicator with which you can navigate to previous steps.</p>
            <img src={"screenshots/progress-indicator.png"} alt="Progress indicator" className="mx-auto mt-4 mb-5 w-full max-w-3xl"/>
            <p>If you are not sure about the meaning of any question you can click on the light bulb <FaRegLightbulb className="inline fill-[#0084d7] w-6 h-6" /> to get an explanation.</p>
            <br />
            <p>If you want to extend the session, you can click on the extension icon {" "}<VscExtensions className="inline fill-[#0084d7] w-6 h-6" />
              {" "}to extend the session by one step. Please note that the session cannot be extended beyond 14 steps.</p>
            <br />
            <p>When you have arrived at the end of your session, you will see a report with the suggested course of action.
              At this stage you can restart the session using the start icon <ImSwitch className="inline relative -top-1 fill-[#0084d7]" />.</p>

          </IntroSection>
        </section>
      </>
    </GenericDialogue>
  )
}