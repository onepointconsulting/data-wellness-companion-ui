import GenericDialogue from "./GenericDialogue.tsx";
import { SiWelcometothejungle } from "react-icons/si";
import { FaRegLightbulb } from "react-icons/fa6";
import { VscExtensions } from "react-icons/vsc";
import { MdOutlineIntegrationInstructions } from "react-icons/md";

import OnepointInfo from "./OnepointInfo.tsx";
import onCloseDialogue from "../../lib/dialogFunctions.ts";
import { setSeenIntro } from "../../lib/sessionFunctions.ts";
import { ImSwitch } from "react-icons/im";
import { useTranslation } from "react-i18next";

export const INTRO_DIALOGUE_ID = "intro-dialogue";

const toolName = " Data Wellness Companion";

function IntroSection({
  content,
  children,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      <h3 className="pb-4 pt-2">
        <MdOutlineIntegrationInstructions className="inline relative -top-0.5 fill-[#0084d7]" />{" "}
        {content}
      </h3>
      {children}
    </>
  );
}

/**
 * The introduction dialogue.
 * @constructor
 */
export default function IntroDialogue() {
  const { t } = useTranslation();
  return (
    <GenericDialogue
      dialogueId={INTRO_DIALOGUE_ID}
      clazz="companion-dialogue"
      buttons={
        <button
          data-close-modal={true}
          onClick={() => {
            setSeenIntro();
            onCloseDialogue(INTRO_DIALOGUE_ID);
          }}
          className="button-cancel"
        >
          Close
        </button>
      }
    >
      <>
        <h2>
          <SiWelcometothejungle className="inline relative -top-0.5 fill-[#0084d7]" />{" "}
          {t("Welcome")}
        </h2>
        <section className="mx-3 mt-10">
          <OnepointInfo />
          <br />
          <IntroSection content={`${t("How can you use the", {'toolName': toolName})}`}>
            <p>
              {t("explanation 1", {'toolName': toolName})}
            </p>
            <p>
              {t("explanation 2")}
              <img
                src={"screenshots/" + t("predefined-image")}
                alt="Pre-defined answers"
                className="mx-auto mt-4 mb-5"
              />
              <span dangerouslySetInnerHTML={
                {__html: t('explanation 3 submit', {interpolation: {escapeValue: false}})}
              } />
            </p>
            <br />
            <p>
              {t("explanation 4 steps", {'toolName': toolName})}
            </p>
            <img
              src={"screenshots/progress-indicator.png"}
              alt="Progress indicator"
              className="mx-auto mt-4 mb-5 w-full max-w-3xl"
            />
            <p>
              {t("explanation 5 lightbulb", {'toolName': toolName})}{" "}<FaRegLightbulb className="inline fill-[#0084d7] w-6 h-6" />
            </p>
            <br />
            <p>
              {t("explanation 6 session")}{" "}
              <VscExtensions className="inline fill-[#0084d7] w-6 h-6" />
            </p>
            <br />
            <p>
              {t("explanation 7 end")}{" "}
              <ImSwitch className="inline relative -top-1 fill-[#0084d7]" />
            </p>
          </IntroSection>
        </section>
      </>
    </GenericDialogue>
  );
}
