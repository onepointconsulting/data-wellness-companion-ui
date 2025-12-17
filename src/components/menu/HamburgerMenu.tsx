import StartButton from "./StartButton.tsx";
import ContactUsButton from "./ContactUsButton.tsx";
import DarkModeButton from "./DarkModeButton.tsx";
import SessionSwitch from "./SessionSwitch.tsx";
import TermsButton from "./TermsButton.tsx";
import HamburgerWrapper from "./HamburgerWrapper.tsx";
import InfoButton from "./InfoButton.tsx";
import ChatModeButton from "./ChatModeButton.tsx";

const MenuItems=[
  <StartButton />,
  <InfoButton />,
  <ContactUsButton />,
  <SessionSwitch />,
  <DarkModeButton />,
  <ChatModeButton />
]

/**
 * The Hamburger menu component.
 * @constructor
 */
export default function HamburgerMenu() {
  return (
    <HamburgerWrapper>
      <StartButton />
            {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}
      <InfoButton />
            {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}
      <ContactUsButton />
        {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}


      {window.dataWellnessConfig.termsLink && <TermsButton />}
                  {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}

      <SessionSwitch />
      {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}
      <DarkModeButton />
      {/* <hr className="mt-2 mb-6 h-[1px] bg-black dark:bg-gray-100 w-full" /> */}

      <ChatModeButton />
    </HamburgerWrapper>
  );
}
