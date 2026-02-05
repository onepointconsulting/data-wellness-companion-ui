import StartButton from "./StartButton.tsx";
import ContactUsButton from "./ContactUsButton.tsx";
import DarkModeButton from "./DarkModeButton.tsx";
import SessionSwitch from "./SessionSwitch.tsx";
import TermsButton from "./TermsButton.tsx";
import HamburgerWrapper from "./HamburgerWrapper.tsx";
import InfoButton from "./InfoButton.tsx";
import MenuSeparator from "./MenuSeparator.tsx";
/**
 * The Hamburger menu component.
 * @constructor
 */
export default function HamburgerMenu() {
  return (
    <HamburgerWrapper>
      <StartButton />
      <SessionSwitch />
      <DarkModeButton />
      <MenuSeparator />
      <InfoButton />
      <ContactUsButton />
      {window.dataWellnessConfig.termsLink && <TermsButton />}
    </HamburgerWrapper>
  );
}
