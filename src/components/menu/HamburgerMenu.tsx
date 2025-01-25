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
      <InfoButton />
      <ContactUsButton />
      <TermsButton />
      <SessionSwitch />
      <hr className="mt-6 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" />
      <DarkModeButton />
      <ChatModeButton />
    </HamburgerWrapper>
  );
}
