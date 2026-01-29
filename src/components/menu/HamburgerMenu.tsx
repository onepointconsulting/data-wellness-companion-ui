import StartButton from "./StartButton.tsx";
import ContactUsButton from "./ContactUsButton.tsx";
import DarkModeButton from "./DarkModeButton.tsx";
import SessionSwitch from "./SessionSwitch.tsx";
import TermsButton from "./TermsButton.tsx";
import HamburgerWrapper from "./HamburgerWrapper.tsx";
import InfoButton from "./InfoButton.tsx";
import ChatModeButton from "./ChatModeButton.tsx";
/**
 * The Hamburger menu component.
 * @constructor
 */
export default function HamburgerMenu() {
  return (
    <HamburgerWrapper>
      <StartButton />
      <hr className="my-4 md:my-2 h-px w-full border-0 bg-gray-300 dark:bg-gray-100" />
      <InfoButton />
      <hr className="my-4 md:my-2 h-px w-full border-0 bg-gray-300 dark:bg-gray-100" />

      <ContactUsButton />
      <hr className="my-4 md:my-2 h-px w-full border-0 bg-gray-300 dark:bg-gray-100" />

      {window.dataWellnessConfig.termsLink && <TermsButton />}

      <SessionSwitch />
      <DarkModeButton />
      <hr className="my-4 md:my-2 h-px w-full border-0 bg-gray-300 dark:bg-gray-100" />

      <ChatModeButton />
    </HamburgerWrapper>
  );
}
